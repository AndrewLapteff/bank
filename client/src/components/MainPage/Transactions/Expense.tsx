import { TransactionType } from '../../../types/TransacionType'

const Expense: React.FC<{ transaction: TransactionType }> = ({
  transaction,
}) => {
  return (
    <div className="flex justify-center items-center mt-3 mb-3">
      <div className="w-full flex items-center justify-around">
        <div className="flex items-center">
          <div className="bg-[#df4242] rounded-full w-fit h-fit p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              color="#1B1B23"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
              />
            </svg>
          </div>
          <span className="ml-3 text-xl">Expense</span>
        </div>
        <div className="flex items-center">
          <div className="bg-[#343434] rounded-full w-fit h-fit p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="ml-3 text-md">
            {`${new Date(transaction.createdAt).toLocaleString('en-uk', {
              month: 'long',
            })} `}
            {`${new Date(transaction.createdAt).getDate()} `}
            {new Date(transaction.createdAt).getFullYear()}
          </span>
        </div>
        <div className="flex items-center">
          <div className="bg-[#343434] rounded-full w-fit h-fit p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#cacaca"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="ml-3 text-xl font-medium">
            {`${transaction.amount}`}
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
              className="w-6 h-6"
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
              className="w-6 h-6"
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
    </div>
  )
}

export default Expense
