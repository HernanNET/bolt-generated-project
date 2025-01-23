import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Product } from '../../types/database'
import styles from './ProductsCRUD.module.css'

const ProductsCRUD = () => {
  const queryClient = useQueryClient()
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null)

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) throw error
      return data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
      if (error) throw error
      return data[0]
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  })

  const updateMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', product.id)
        .select()
      if (error) throw error
      return data[0]
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProduct) return
    
    if (editProduct.id) {
      updateMutation.mutate(editProduct as Product)
    } else {
      createMutation.mutate(editProduct)
    }
    setEditProduct(null)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className={styles.container}>
      <h2>Products</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Product name"
          value={editProduct?.name || ''}
          onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={editProduct?.price || ''}
          onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
          required
        />
        <button type="submit">
          {editProduct?.id ? 'Update' : 'Create'} Product
        </button>
      </form>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>
                  <button onClick={() => setEditProduct(product)}>Edit</button>
                  <button onClick={() => deleteMutation.mutate(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductsCRUD
