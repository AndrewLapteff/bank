import 'chart.js/auto'
import { useContext, useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
Plugin
import { StoreContext } from '../../../App'
import { observer } from 'mobx-react-lite'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const Sidebar = observer(() => {
  const { transactions } = useContext(StoreContext)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    transactions.getAllExpencesAndIncomes()
  }, [transactions])

  const handleAddMoney = () => {
    transactions.addMoney(+amount)
    setAmount('')
  }

  return (
    <aside className="flex h-full w-3/12 flex-col items-center justify-between rounded-2xl bg-bg-color p-5">
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
      <div className="flex h-36 w-full flex-col items-center gap-2">
        <h4 className="text-xl font-bold">Add money</h4>
        <input
          className="w-44 rounded-lg p-1 text-center text-xl placeholder:text-center"
          placeholder="Amount"
          type="number"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <button
          className="focus:shadow-outline  w-3/5 rounded-md bg-blue-500 py-2 text-lg font-bold text-white hover:bg-blue-700 focus:outline-none active:bg-blue-600"
          onClick={() => handleAddMoney()}
        >
          Add
        </button>
      </div>
    </aside>
  )
})

export default Sidebar
