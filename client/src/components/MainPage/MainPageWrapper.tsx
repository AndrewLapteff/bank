import HeaderWrapper from './HeaderWrapper'
import TransactionsWrapper from './TransactionsWrapper'

const MainPageWrapper = () => {
  return (
    <div className="h-screen bg-[url('public/bg.jpg')] absolute top-0 left-0 right-0 bottom-0 bg-blend-multiply bg-[#00000088] bg-cover">
      <HeaderWrapper />
      <TransactionsWrapper />
    </div>
  )
}

export default MainPageWrapper
