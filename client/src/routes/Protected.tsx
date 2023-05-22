import { FC } from 'react'
import { Navigate } from 'react-router-dom'
import { cookies } from '../api/api'
interface ProdectedProps {
  isLoading: boolean
  isAuth: boolean
  navigatePath: string
  children: JSX.Element
}
const Protected: FC<ProdectedProps> = ({ isAuth, navigatePath, children }) => {
  if (!isAuth) {
    return <Navigate to={navigatePath} replace />
  }
  return children
}
export default Protected
