import Transactions from './Transactions/Transactions'
import TransactionsDiagram from './Transactions/TransactionsDiagram'

const TransactionsWrapper = () => {
  return (
    <div className="pt-5 w-full h-4/5 flex items-start justify-center gap-4">
      <Transactions />
      <TransactionsDiagram />
    </div>
  )
}

export default TransactionsWrapper
