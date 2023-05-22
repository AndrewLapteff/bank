import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useContext, useState } from 'react'
import * as Yup from 'yup'
import { StoreContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { ErrorStr } from '../../types/Error.interface'

const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string().when('validatePhoneNumber', {
    is: true,
    then: (schema) =>
      schema
        .matches(
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,4}$/,
          '0991234567'
        )
        .required('Phone number is a required field'),
  }),

  CVV: Yup.number().when('validateCVV', {
    is: true,
    then: (schema) =>
      schema
        .min(100, 'Too low value')
        .max(999, 'Too high value')
        .required('CVV  is a required field'),
  }),

  newPassword: Yup.string().when('validateNewPassword', {
    is: true,
    then: (schema) =>
      schema.min(6).max(18).required('Password is a required field'),
  }),

  password: Yup.string()
    .min(6)
    .max(18)
    .required('Password is a required field'),
})
export interface ValidateUserFields {
  phoneNumber?: string
  CVV?: string
  newPassword?: string
  password: string
  validatePhoneNumber?: boolean
  validateCVV?: boolean
  validateNewPassword?: boolean
}
type UpdateUserFields = Omit<
  ValidateUserFields,
  'validatePhoneNumber' | 'validateCVV' | 'validateNewPassword'
>
const initialValues = {
  phoneNumber: '',
  CVV: '',
  newPassword: '',
  password: '',
}

const AccountSettings = () => {
  const { auth } = useContext(StoreContext)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const handleSubmit = async (values: ValidateUserFields) => {
    const {
      phoneNumber,
      CVV,
      newPassword,
      password,
      validateCVV,
      validateNewPassword,
      validatePhoneNumber,
    } = values
    setError('')
    if (!validateNewPassword && !validateCVV && !validatePhoneNumber) {
      setError('No updates')
      return
    }
    const data = {} as UpdateUserFields
    data.phoneNumber = validatePhoneNumber ? '+38' + phoneNumber : undefined
    data.CVV = validateCVV ? CVV : undefined
    data.newPassword = validateNewPassword ? newPassword : undefined
    data.password = password
    const response: void | AxiosError<ErrorStr> = await auth.updateUserData(
      data
    )
    if (response instanceof AxiosError) {
      if (response.response) setError(response.response.data.message)
      return
    } else {
      navigate('/')
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex h-screen items-center justify-center bg-[#00000088] bg-[url('public/bg.jpg')] bg-cover bg-blend-multiply">
      <div className="flex h-[30rem] w-96 flex-col items-center justify-evenly rounded-lg bg-slate-900">
        <h4 className="text-lg font-bold">Change:</h4>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mx-auto w-5/6 max-w-md">
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-bold text-white"
              >
                <Field type="checkbox" name="validatePhoneNumber" />
                Phone number:
              </label>
              <Field
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-white shadow focus:outline-none"
                placeholder="0991234567"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="CVV"
                className="mb-2 block text-sm font-bold text-white"
              >
                <Field type="checkbox" name="validateCVV" />
                CVV:
              </label>
              <Field
                type="text"
                id="CVV"
                name="CVV"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-white shadow focus:outline-none"
                placeholder="***"
              />
              <ErrorMessage
                name="CVV"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-bold text-white"
              >
                <Field type="checkbox" name="validateNewPassword" />
                Password:
              </label>
              <Field
                type="newPassword"
                id="newPassword"
                name="newPassword"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-white shadow focus:outline-none"
                placeholder=""
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-white"
              >
                Confirm password:
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-white shadow focus:outline-none"
                placeholder=""
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            {error != '' ? (
              <div className="mb-3 text-center text-red-500">{error}</div>
            ) : (
              'ㅤ'
            )}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="focus:shadow-outline  w-3/5  rounded bg-blue-500 px-4 py-2 text-lg font-bold text-white hover:bg-blue-700 focus:outline-none"
              >
                Save
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default AccountSettings
