import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useContext, useState } from 'react'
import { AxiosError } from 'axios'
import { StoreContext } from '../../App'
import { ErrorArrStr } from '../../types/Error.interface'
import { NavLink } from 'react-router-dom'

const RegisterPage = () => {
  const { auth } = useContext(StoreContext)
  const [requestErrors, setRequestErrors] = useState<string[]>([])
  const [errorField, setErrorField] = useState({
    fullname: true,
    number: true,
    password: true,
  })

  const registrationHandler = async (
    username: string,
    phoneNumber: string,
    password: string
  ) => {
    const axiosError: void | AxiosError<ErrorArrStr> = await auth.registration(
      username,
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
      setRequestErrors(['The user is registred. Login please'])
    }
  }

  const validateFullname = (value: string) => {
    let error
    if (!value) {
      error = 'Required field'
    } else if (!value.match(/^[a-zA-Z]+ [a-zA-Z]+$/)) {
      error = 'Jonh Doe'
    } else if (value.length > 20) {
      error = 'Too long fullname'
    }
    if (error == undefined) {
      setErrorField({ ...errorField, fullname: true })
    }
    return error
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
    if (error == undefined) {
      setErrorField({ ...errorField, number: true })
    }
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
    if (error === undefined) setErrorField({ ...errorField, password: true })
    return error
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[url('public/bg.jpg')] bg-cover">
      <div className="flex h-[28rem] w-96 flex-col items-center justify-evenly rounded-lg bg-slate-900">
        <h3 className="font-mediumw scale-150">Registration</h3>
        <Formik
          initialValues={{ username: '', phoneNumber: '', password: '' }}
          onSubmit={(values) => {
            registrationHandler(
              values.username,
              values.phoneNumber,
              values.password
            )
          }}
        >
          <Form className="flex w-4/5 flex-col justify-between">
            <div className="flex flex-col">
              <label htmlFor="name">FullName:</label>
              <Field
                className="rounded-md p-1 text-lg"
                type="text"
                id="name"
                name="username"
                placeholder="Jonh Doe"
                validate={validateFullname}
              />
              {errorField.fullname && <div>ㅤ</div>}
              <ErrorMessage name="username" component="div" className="error">
                {(msg) => {
                  setErrorField({ ...errorField, fullname: false })
                  return <div style={{ color: 'red' }}>{msg}</div>
                }}
              </ErrorMessage>
            </div>
            <div className="flex flex-col">
              <label htmlFor="number">Number:</label>
              <Field
                className="rounded-md p-1 text-lg"
                type="text"
                id="number"
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
                className="rounded-md p-1"
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
              <span className={`text-center font-bold`}>{requestErrors}</span>
            )}
            <button
              type="submit"
              className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 active:bg-blue-950 dark:bg-blue-600 dark:hover:bg-blue-700  "
            >
              Register
            </button>
          </Form>
        </Formik>
        <NavLink to={'/login'}>Login</NavLink>
      </div>
    </div>
  )
}

export default RegisterPage
