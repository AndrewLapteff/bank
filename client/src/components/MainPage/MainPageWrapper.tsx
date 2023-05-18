import { useContext } from 'react'
import { AuthContext } from '../../App'
import HeaderWrapper from './HeaderWrapper'
import TransactionsWrapper from './TransactionsWrapper'
const eventSource = new EventSource('http://localhost:3000/transactions/sse')
eventSource.onmessage = ({ data }) => {
  console.log('New message', JSON.parse(data))
}
const MainPageWrapper = () => {
  const { store } = useContext(AuthContext)
  return (
    <div className="h-screen bg-[url('public/bg.jpg')] absolute top-0 left-0 right-0 bottom-0 bg-blend-multiply bg-[#00000088] bg-cover">
      <HeaderWrapper />
      <TransactionsWrapper />
    </div>
  )
}

export default MainPageWrapper
