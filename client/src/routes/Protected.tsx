import { Navigate } from 'react-router-dom'
interface ProdectedProps {
  isAuth: boolean
  navigatePath: string
  children: JSX.Element
}
const Protected: React.FC<ProdectedProps> = ({
  isAuth,
  navigatePath,
  children,
}) => {
  if (!isAuth) {
    return <Navigate to={navigatePath} replace />
  }
  return children
}
export default Protected
