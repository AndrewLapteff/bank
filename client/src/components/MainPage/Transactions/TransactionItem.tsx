import { FC, useContext } from 'react'
import { Transaction } from '../../../types/Transaction'
import { StoreContext } from '../../../App'

const TransactionItem: FC<{ transaction: Transaction }> = ({ transaction }) => {
  const { auth } = useContext(StoreContext)

  const addZeros = (amount: number) => {
    if (+amount % 1 == 0) {
      return amount + ',00'
    }
    return amount
  }

  return (
    <li className="mb-3 mt-3 flex items-center justify-center">
      <div className="flex w-full items-center justify-around">
        <div className="flex items-center">
          {auth.user.id === transaction.receiverId ? (
            <>
              <div className="h-fit w-fit rounded-full bg-[#4ddf42] p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  color="#1B1B23"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                  />
                </svg>
              </div>
              <span className="ml-3 mr-2 text-xl">Income </span>
            </>
          ) : (
            <>
              <div className="h-fit w-fit rounded-full bg-[#df4242] p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  color="#1B1B23"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
                  />
                </svg>
              </div>
              <span className="ml-3 text-xl">Expense</span>
            </>
          )}
        </div>
        <div className="flex items-center">
          <div className="h-fit w-fit rounded-full bg-[#343434] p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-md ml-3 flex flex-col items-center">
            <time className="text-[1.1rem]">
              {`${new Date(transaction.createdAt).getHours()}:`}
              {`${new Date(transaction.createdAt).getMinutes()}`}
              {/* {`:${new Date(transaction.createdAt).getSeconds()}`} */}
            </time>
            <div className="text-[11px]">
              {`${new Date(transaction.createdAt).getFullYear()}/`}
              {`${new Date(transaction.createdAt).getMonth()}/`}
              {`${new Date(transaction.createdAt).getDate()}`}
            </div>
          </div>
        </div>
        <div className="ml-5 flex w-32 items-center justify-start">
          <div className="h-fit w-fit rounded-full bg-[#343434] p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#f8f817"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="ml-3 text-xl font-medium">
            {addZeros(transaction.amount)}
          </span>
        </div>
        <div>
          {transaction.accepted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="rgb(46, 220, 89)"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="rgb(208, 48, 48)"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
      </div>
    </li>
  )
}

export default TransactionItem
