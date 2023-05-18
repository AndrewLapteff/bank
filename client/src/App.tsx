import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/api'
import { Context, createContext, useEffect } from 'react'
import AuthStore, { TransactionsStore } from './app/store'
import { observer } from 'mobx-react-lite'
import RoutesClient from './routes/Routes'

interface IState {
  transactions: TransactionsStore
  auth: AuthStore
}

const transactions = new TransactionsStore()
const auth = new AuthStore()

export const AuthContext: Context<IState> = createContext<IState>({
  transactions,
  auth,
})

const App = observer(() => {
  useEffect(() => {
    auth.checkUser()
  }, [])
  if (auth.isLoading) {
    return (
      <span className="text-2xl w-full h-full flex justify-center items-center">
        Loading...
      </span>
    )
  }
  return (
    <>
      <AuthContext.Provider value={{ transactions, auth }}>
        <QueryClientProvider client={queryClient}>
          <RoutesClient />
        </QueryClientProvider>
      </AuthContext.Provider>
    </>
  )
})

export default App
