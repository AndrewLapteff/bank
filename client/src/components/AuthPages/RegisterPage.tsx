import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [requestErrors, setRequestErrors] = useState([]);
  const [errorField, setErrorField] = useState({
    fullname: true,
    number: true,
    password: true,
  });

  const registrationHandler = async (
    username: string,
    phoneNumber: string,
    password: string
  ) => {
    const user = {
      user: {
        username,
        phoneNumber: '+38' + phoneNumber,
        password,
      },
    };
    axios
      .post('http://localhost:3000/users/registration', user)
      .then((res) => {
        setRequestErrors([]);
        console.log(res);
      })
      .catch((err) => setRequestErrors(err.response.data.message));
  };

  const validateFullname = (value: string) => {
    let error;
    if (!value) {
      error = 'Required field';
    } else if (!value.match(/^[a-zA-Z]+ [a-zA-Z]+$/)) {
      error = 'Jonh Doe';
    } else if (value.length > 20) {
      error = 'Too long fullname';
    }
    if (error == undefined) {
      setErrorField({ ...errorField, fullname: true });
    }
    return error;
  };
  const validateNumber = (value: string) => {
    let error;
    if (!value) {
      error = 'Required field';
    } else if (
      !value.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,4}$/)
    ) {
      error = '0991234567';
    }
    console.log(errorField.fullname);
    if (error == undefined) {
      setErrorField({ ...errorField, number: true });
    }
    return error;
  };
  const validatePassword = (value: string) => {
    let error;
    if (!value) {
      error = 'Required field';
    } else if (value.length < 6) {
      error = 'Password should have more then 6 chars';
    } else if (value.length > 20) {
      error = 'Too long password';
    }
    if (error === undefined) setErrorField({ ...errorField, password: true });
    return error;
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[url('https://images.unsplash.com/photo-1494488180300-4c634d1b2124?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80')] bg-cover">
      <div className="flex flex-col justify-evenly items-center w-96 h-96 bg-slate-900 rounded-lg">
        <h3 className="scale-125">Registration</h3>
        <Formik
          initialValues={{ username: '', phoneNumber: '', password: '' }}
          onSubmit={(values) => {
            registrationHandler(
              values.username,
              values.phoneNumber,
              values.password
            );
          }}
        >
          <Form className="w-4/5 h-4/5 flex flex-col justify-between">
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
                  setErrorField({ ...errorField, fullname: false });
                  return <div style={{ color: 'red' }}>{msg}</div>;
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
                  setErrorField({ ...errorField, number: false });
                  return <div style={{ color: 'red' }}>{msg}</div>;
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
                  setErrorField({ ...errorField, password: false });
                  return <div style={{ color: 'red' }}>{msg}</div>;
                }}
              </ErrorMessage>
            </div>
            {requestErrors.length == 0 ? (
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
      </div>
    </div>
  );
};

export default RegisterPage;
