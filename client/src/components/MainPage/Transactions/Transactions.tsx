import { AxiosResponse } from 'axios'
import { TransactionType } from '../../../types/TransacionType'
import Expense from './Expense'
import Income from './Income'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import TransactionService from '../../../services/TransactionsService'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../../App'

const Transactions = () => {
  const { transactions } = useContext(AuthContext)
  useEffect(() => {
    transactions.getAllTransaction()
  }, [])
  const {
    data,
    isLoading,
    isError,
    failureReason,
  }: UseQueryResult<AxiosResponse<{ transactions: TransactionType[] }>> =
    useQuery({
      queryKey: ['transactions'],
      queryFn: () => TransactionService.getAllTransactions(),
    })
  // if (isLoading) return <div>loading</div>
  // if (isError) return <div>error</div>
  return (
    <div className="bg-bg-color p-5 rounded-2xl flex flex-col justify-start w-6/12 h-full">
      <h2 className="text-2xl font-bold h-fit ml-2 mb-4">
        Recent transactions
      </h2>
      {isLoading && <div className="text-center">Loading...</div>}
      {isError && <div className="text-center">Something went wrong</div>}
      {/* {data.data.transactions.map((trans) =>
        trans.senderId === userInfo.id ? (
          <Expense transaction={trans} key={trans.id} />
        ) : (
          <Income transaction={trans} key={trans.id} />
        )
      )} */}
    </div>
  )
}

export default Transactions
