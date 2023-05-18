import 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'

const TransactionsDiagram = () => {
  const TransactionData = [200, 100]

  return (
    <div className="bg-bg-color p-5 rounded-2xl flex flex-col items-center w-3/12 h-full">
      <Doughnut
        data={{
          labels: ['Expenses', 'Incomes'],
          datasets: [
            {
              label: 'Transactions',
              borderColor: 'white',
              backgroundColor: ['#df4242', '#4ddf42'],
              data: TransactionData,
            },
          ],
        }}
        options={{
          color: 'white',
        }}
      />
    </div>
  )
}

export default TransactionsDiagram
