import HeaderWrapper from './HeaderWrapper'
import TransactionsWrapper from './TransactionsWrapper'

const MainPageWrapper = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 h-screen bg-[#00000088] bg-[url('public/bg.jpg')] bg-cover bg-blend-multiply">
      <HeaderWrapper />
      <TransactionsWrapper />
    </div>
  )
}

export default MainPageWrapper
