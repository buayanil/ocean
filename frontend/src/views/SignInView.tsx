import React from 'react';

import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { loginStart } from '../redux/slices/userSlice';

import SignInForm from '../components/SignInForm';
import UserLayout from '../layouts/UserLayout';


interface SignInViewProps {}

const SignInView: React.FC<SignInViewProps> = () => {
  const user = useAppSelector((state) => state.user.user);
  const err = useAppSelector((state) => state.user.error);
  const dispatch = useAppDispatch();
  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your HTW account</h2>
        </div>
        <div onClick={() => dispatch(loginStart({username: 'u', password: 'p'}))}>User: {user ? user.firstName : ""}</div>
        {err}
        <SignInForm />
    </div>
  </UserLayout>
  );
}

export default SignInView;
