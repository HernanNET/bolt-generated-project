export interface Product {
  id: number
  name: string
  price: number
  description?: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
      }
    }
  }
}
