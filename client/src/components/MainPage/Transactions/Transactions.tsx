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
    transactions.setPage(page)
  }
  return (
    <section className="flex h-full w-6/12 flex-col justify-between rounded-2xl bg-bg-color p-5">
      <div>
        <h2 className="ml-2 h-fit text-2xl font-bold">Recent transactions</h2>
      </div>
      <ul className="flex h-5/6 flex-col justify-start">
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
      </ul>
      <nav>
        <ul className="ml-5 flex gap-3">
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
        </ul>
      </nav>
    </section>
  )
})

export default Transactions
