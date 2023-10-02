import AccountInfo from './Header/AccountInfo'
import CardInfo from './Header/CardInfo'

const HeaderWrapper = () => {
  return (
    <header className="mt-10 flex h-[80px] w-screen items-center justify-center gap-4">
      <CardInfo />
      <AccountInfo />
    </header>
  )
}

export default HeaderWrapper
