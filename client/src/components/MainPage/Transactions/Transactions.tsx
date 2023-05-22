import TransactionItem from './TransactionItem'
import { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../../App'
import { observer } from 'mobx-react-lite'
import { PaginationButton } from './PaginationButton'

const Transactions = observer(() => {
  const { transactions } = useContext(StoreContext)
  const countOfPages = Math.ceil(transactions.count / 7)
  const [currentPage, setCurrentPage] = useState(1)
  const pageNumbers = Array.from(
    { length: countOfPages },
    (_, index) => index + 1
  )

  useEffect(() => {
    transactions.getTransactionWithLimitOffset(7, 1)
  }, [transactions])

  const setCurrentPageHandler = (page: number) => {
    transactions.getTransactionWithLimitOffset(7, page)
    setCurrentPage(page)
  }
  return (
    <div className="bg-bg-color p-5 rounded-2xl flex flex-col justify-between w-6/12 h-full">
      <div>
        <h2 className="text-2xl font-bold h-fit ml-2">Recent transactions</h2>
      </div>
      <div className="h-5/6 flex flex-col justify-between">
        {transactions.isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          transactions.transactions.map((i) => {
            return <TransactionItem key={Math.random()} transaction={i} />
          })
        )}
        {transactions.isError && (
          <div className="text-center">Something went wrong</div>
        )}
      </div>
      <div className="flex gap-3 ml-5">
        {pageNumbers.map((page) => {
          return (
            <PaginationButton
              page={page}
              isActive={page === currentPage}
              onClick={() => setCurrentPageHandler(page)}
              key={Math.random()}
            />
          )
        })}
      </div>
    </div>
  )
})

export default Transactions
