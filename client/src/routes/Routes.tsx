import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from '../components/AuthPages/LoginPage'
import RegisterPage from '../components/AuthPages/RegisterPage'
import MainPageWrapper from '../components/MainPage/MainPageWrapper'
import Protected from './Protected'
import { StoreContext } from '../App'
import { observer } from 'mobx-react-lite'
import AccountSettings from '../components/AccountSettings/AccountSettings'

const RoutesClient = observer(() => {
  const { auth } = useContext(StoreContext)
  return (
    <div>
      {!auth.isLoading && (
        <Routes>
          <Route
            path="/"
            element={
              <Protected
                isLoading={auth.isLoading}
                isAuth={auth.isAuth}
                navigatePath="/login"
              >
                <MainPageWrapper />
              </Protected>
            }
          />
          <Route
            path="/account"
            element={
              <Protected
                isLoading={auth.isLoading}
                isAuth={auth.isAuth}
                navigatePath="/login"
              >
                <AccountSettings />
              </Protected>
            }
          />
          <Route
            path="/registration"
            element={
              <Protected
                isLoading={auth.isLoading}
                isAuth={!auth.isAuth}
                navigatePath="/"
              >
                <RegisterPage />
              </Protected>
            }
          />
          <Route
            path="/login"
            element={
              <Protected
                isLoading={auth.isLoading}
                isAuth={!auth.isAuth}
                navigatePath="/"
              >
                <LoginPage />
              </Protected>
            }
          />
        </Routes>
      )}
    </div>
  )
})
export default RoutesClient
