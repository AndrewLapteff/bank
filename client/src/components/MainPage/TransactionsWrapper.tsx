import Transactions from './Transactions/Transactions'
import Sidebar from './Transactions/Sidebar'

const TransactionsWrapper = () => {
  return (
    <main className="flex h-4/5 w-full items-start justify-center gap-4 pt-5">
      <Transactions />
      <Sidebar />
    </main>
  )
}

export default TransactionsWrapper
