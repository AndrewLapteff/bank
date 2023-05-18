import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useContext, useState } from 'react'
import { AxiosError } from 'axios'
import { AuthContext } from '../../App'
import { IError } from '../../types/Error.interface'
import { NavLink } from 'react-router-dom'

const RegisterPage = () => {
  const { store } = useContext(AuthContext)
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
    const axiosError: void | AxiosError<IError> = await store.registration(
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
      setRequestErrors([])
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
    <div className="h-screen flex justify-center items-center bg-[url('public/bg.jpg')] bg-cover">
      <div className="flex flex-col justify-evenly items-center w-96 h-[28rem] bg-slate-900 rounded-lg">
        <h3 className="scale-150 font-mediumw">Registration</h3>
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
          <Form className="w-4/5 flex flex-col justify-between">
            <div className="flex flex-col">
              <label htmlFor="name">FullName:</label>
              <Field
                className="p-1 text-lg rounded-md"
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
                className="p-1 text-lg rounded-md"
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
