import 'chart.js/auto'
import { useContext, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
Plugin
import { StoreContext } from '../../../App'
import { observer } from 'mobx-react-lite'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const TransactionsDiagram = observer(() => {
  const { transactions } = useContext(StoreContext)

  useEffect(() => {
    transactions.getAllExpencesAndIncomes()
  }, [transactions])

  return (
    <div className="bg-bg-color p-5 rounded-2xl flex flex-col items-center w-3/12 h-full">
      <Doughnut
        plugins={[ChartDataLabels as any]}
        data={{
          labels: ['Expenses', 'Incomes'],
          datasets: [
            {
              label: 'Transactions',

              borderColor: 'white',
              backgroundColor: ['#df4242', '#4ddf42'],
              data: [
                transactions.totalAmount.expenses,
                transactions.totalAmount.incomes,
              ],
            },
          ],
        }}
        options={{
          color: 'white',
          plugins: {
            datalabels: {
              display: true,
              rotation: function () {
                return 0
              },
              font: { weight: 'bolder', size: 17 },
              color: ['rgb(255 255, 255)'],
            },
          },
        }}
      />
    </div>
  )
})

export default TransactionsDiagram
