import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useContext, useState } from 'react'
import { StoreContext } from '../../App'
import { AxiosError } from 'axios'
import { IError } from '../../types/Error.interface'
import { NavLink, NavigateFunction, useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const { auth } = useContext(StoreContext)
  const [requestErrors, setRequestErrors] = useState<string[]>([])
  const [errorField, setErrorField] = useState({
    number: true,
    password: true,
  })
  const navigate: NavigateFunction = useNavigate()

  const loginHandler = async (
    phoneNumber: string,
    password: string
  ): Promise<void> => {
    const axiosError: unknown | AxiosError<IError> = await auth.login(
      phoneNumber,
      password
    )
    if (axiosError instanceof AxiosError) {
      // if array
      if (
        axiosError.response &&
        axiosError.response.data.message instanceof Array
      ) {
        setRequestErrors(axiosError.response?.data.message)
      }
      // if string
      if (
        axiosError.response &&
        typeof axiosError.response.data.message === 'string'
      ) {
        setRequestErrors([...requestErrors, axiosError.response.data.message])
      }
    } else {
      setRequestErrors([])
      navigate('/')
    }
  }

  const validateNumber = (value: string) => {
    let error
    if (!value) {
      error = 'Required field'
    } else if (
      !value.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,4}$/)
    ) {
      error = '0991234567'
    }
    if (error == undefined) setErrorField({ ...errorField, number: true })
    return error
  }
  const validatePassword = (value: string) => {
    let error
    if (!value) {
      error = 'Required field'
    } else if (value.length < 6) {
      error = 'Password should have more then 6 chars'
    } else if (value.length > 20) {
      error = 'Too long password'
    }
    if (error == undefined) setErrorField({ ...errorField, password: true })
    return error
  }

  return (
    <div className="h-screen flex justify-center items-center bg-[url(public/bg.jpg)] bg-cover">
      <div className="flex flex-col justify-evenly items-center w-96 h-96 bg-slate-900 rounded-lg">
        <h3 className="scale-150 font-medium">Login</h3>
        <Formik
          initialValues={{ phoneNumber: '', password: '' }}
          onSubmit={(values) => {
            loginHandler(values.phoneNumber, values.password)
          }}
        >
          <Form className="w-4/5 h-4/6 flex flex-col justify-between">
            <div className="flex flex-col">
              <label htmlFor="name">Number:</label>
              <Field
                className="p-1 text-lg rounded-md"
                type="text"
                id="name"
                name="phoneNumber"
                placeholder="0991234567"
                validate={validateNumber}
              />
              {errorField.number && <div>ㅤ</div>}
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="error"
              >
                {(msg) => {
                  setErrorField({ ...errorField, number: false })
                  return <div style={{ color: 'red' }}>{msg}</div>
                }}
              </ErrorMessage>
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password:</label>
              <Field
                className="p-1 rounded-md"
                type="password"
                id="password"
                name="password"
                validate={validatePassword}
              />
              {errorField.password && <div>ㅤ</div>}
              <ErrorMessage name="password" component="div" className="error">
                {(msg) => {
                  setErrorField({ ...errorField, password: false })
                  return <div style={{ color: 'red' }}>{msg}</div>
                }}
              </ErrorMessage>
            </div>
            {requestErrors.length === 0 ? (
              <div>ㅤ</div>
            ) : (
              <span className="font-bold text-center">{requestErrors}</span>
            )}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700  "
            >
              Login
            </button>
          </Form>
        </Formik>
        <NavLink to={'/registration'}>Registration</NavLink>
      </div>
    </div>
  )
}

export default LoginPage
