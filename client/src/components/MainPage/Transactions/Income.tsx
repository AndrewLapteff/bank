import { TransactionType } from '../../../types/TransacionType'

const Income: React.FC<{ transaction: TransactionType }> = ({
  transaction,
}) => {
  return (
    <div className="flex justify-center items-center mt-3 mb-3">
      <div className="w-full flex items-center justify-around">
        <div className="flex items-center">
          <div className="bg-[#4ddf42] rounded-full w-fit h-fit p-1">
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
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
              />
            </svg>
          </div>
          <span className="ml-3 text-xl mr-2">Income </span>
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
            {new Date(transaction.createdAt).getDate()}
            {new Date(transaction.createdAt).getMonth()}/
            {new Date(transaction.createdAt).getFullYear()}/
          </span>
        </div>
        <div className="flex items-center">
          <span className="ml-3 text-xl font-medium">
            {`${transaction.amount} $`}
          </span>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Income
