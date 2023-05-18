import AccountInfo from './Header/AccountInfo'
import CardInfo from './Header/CardInfo'

const HeaderWrapper = () => {
  return (
    <div className="mt-10 h-[80px] w-screen flex items-center justify-center gap-4">
      <CardInfo />
      <AccountInfo />
    </div>
  )
}

export default HeaderWrapper
