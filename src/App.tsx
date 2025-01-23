import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProductsCRUD from './components/ProductsCRUD/ProductsCRUD'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Supabase CRUD Interface</h1>
        <ProductsCRUD />
      </div>
    </QueryClientProvider>
  )
}

export default App
