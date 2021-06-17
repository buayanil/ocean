import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { LockClosedIcon } from '@heroicons/react/solid';


interface SignInValues {
  username: string;
  password: string;
}

export interface SignInFormProps {
  loading?: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({ loading }) => {

  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup
      .string()
      .min(4, 'Password should be of minimum 4 characters length')
      .required('Password is required'),
  });

  const getFieldClassNames = (hasError: boolean): string => {
    const common = "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
    if (hasError) {
      return `${common} border-red-600 focus:ring-red-600 focus:border-red-600`
    } else {
      return `${common} border-gray-300 focus:ring-indigo-500 focus:border-indigo-500`
    }
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={schema}
          onSubmit={( values: SignInValues, { setSubmitting }: FormikHelpers<SignInValues>) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 500);
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username*
                </label>
                <div className="mt-1">
                  <Field id="username" name="username" placeholder=""
                    className={getFieldClassNames(errors.username !== undefined && touched.username !== undefined)} />
                  {errors.username && touched.username && (
                    <span className="mt-2 text-sm text-red-600" id="usernameHelp">{errors.username}</span>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <div className="mt-1">
                  <Field id="password" name="password" type="password" placeholder="" 
                    className={getFieldClassNames(errors.password !== undefined && touched.password !== undefined)} />
                  {errors.password && touched.password && (
                    <span className="mt-2 text-sm text-red-600" id="passwordHelp">{errors.password}</span>
                  )}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                  </span>
                  Sign in
                </button>
              </div>
          </Form>
        )}
      </Formik>
    </div>
  </div>
  );
}

export default SignInForm;
