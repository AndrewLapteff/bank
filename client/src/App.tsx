import { QueryClientProvider } from '@tanstack/react-query'
import { cookies, queryClient } from './api/api'
import { Context, createContext, useEffect, useState } from 'react'
import AuthStore, { TransactionsStore } from './app/store'
import { observer } from 'mobx-react-lite'
import RoutesClient from './routes/Routes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface IState {
  transactions: TransactionsStore
  auth: AuthStore
}

const transactions = new TransactionsStore()
const auth = new AuthStore()

export const StoreContext: Context<IState> = createContext<IState>({
  transactions,
  auth,
})

const App = observer(() => {
  const [isChecked, setCheckStatus] = useState(false)

  useEffect(() => {
    auth.checkUser()
    setCheckStatus(true)
  }, [])

  return (
    <>
      {isChecked && !auth.isLoading ? (
        <StoreContext.Provider value={{ transactions, auth }}>
          <QueryClientProvider client={queryClient}>
            <RoutesClient />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </StoreContext.Provider>
      ) : null}
    </>
  )
})

export default App
