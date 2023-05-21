import { observer } from 'mobx-react-lite'
import { StoreContext } from '../../../App'
import { useContext } from 'react'

const CardInfo = observer(() => {
  const { auth } = useContext(StoreContext)
  return (
    <div className="bg-bg-color p-5 rounded-2xl flex justify-between items-center w-6/12 h-20">
      <div className="flex items-center justify-evenly w-full">
        <div className="flex flex-col">
          <span className="text-gray-600 text-[1.1rem]">CARD NUMBER </span>
          <span className="font-bold text-[1.1rem]">
            {auth.user.cardNumber
              .toString()
              .split('')
              .map((c, i) => (i == 4 || i == 8 || i == 12 ? ` ${c}` : c))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600 text-[1.1rem]">EXPIRE DATE</span>
          <span className="font-bold text-[1.1rem]">01/03</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600 text-[1.1rem]">CVC</span>
          <span className="font-bold text-[1.1rem]">***</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600 text-[1.1rem]">BALANCE</span>
          <span className="font-bold text-[1.1rem]">
            {auth.user.balance != 0 ? auth.user.balance : '0'}
          </span>
        </div>
      </div>
    </div>
  )
})

export default CardInfo
