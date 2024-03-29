import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/api'
import { Context, createContext, useEffect, useState } from 'react'
import AuthStore, { SearchStore, TransactionsStore } from './app/store'
import { observer } from 'mobx-react-lite'
import RoutesClient from './routes/Routes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface IState {
  transactions: TransactionsStore
  auth: AuthStore
  search: SearchStore
}

const auth = new AuthStore()
const transactions = new TransactionsStore(auth)
const search = new SearchStore()

export const StoreContext: Context<IState> = createContext<IState>({
  transactions,
  auth,
  search,
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
        <StoreContext.Provider value={{ transactions, auth, search }}>
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
