import { observer } from 'mobx-react-lite'
import { StoreContext } from '../../../App'
import { useContext, useState } from 'react'

const CardInfo = observer(() => {
  const { auth } = useContext(StoreContext)
  const [isCVVVIsible, setCVVVIsibleStatus] = useState(false)
  return (
    <section className="flex h-20 w-6/12 items-center justify-between rounded-2xl bg-bg-color p-5">
      <div className="flex w-full items-center justify-evenly">
        <div className="flex flex-col">
          <span className="text-[1.1rem] text-gray-600">CARD NUMBER </span>
          <span className="text-[1.1rem] font-bold">
            {auth.user.cardNumber
              .toString()
              .split('')
              .map((c, i) => (i == 4 || i == 8 || i == 12 ? ` ${c}` : c))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[1.1rem] text-gray-600">EXPIRE DATE</span>
          <span className="text-[1.1rem] font-bold">01/03</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[1.1rem] text-gray-600">CVV</span>
          <button
            onClick={() => setCVVVIsibleStatus((prev) => !prev)}
            className="text-[1.1rem] font-bold"
          >
            {isCVVVIsible ? auth.user.CVV : '***'}
          </button>
        </div>
        <div className="flex flex-col">
          <span className="text-[1.1rem] text-gray-600">BALANCE</span>
          <span className="text-[1.1rem] font-bold">
            {auth.user.balance != 0 ? auth.user.balance : '0'}
          </span>
        </div>
      </div>
    </section>
  )
})

export default CardInfo
