import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { OverviewNavigation } from '../constants/menu.';
import { CrendentialProperties } from '../types/models';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { loginStart } from '../redux/slices/userSlice';

import UserLayout from '../layouts/UserLayout';
import SignInForm from '../components/SignInForm';


interface SignInViewProps {}

const SignInView: React.FC<SignInViewProps> = () => {
  const history = useHistory();
  const {loading, error, token} = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      // HINT: Already signed in
      history.push(OverviewNavigation.to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);


  const onSubmit = (credentials: CrendentialProperties) => {
    dispatch(loginStart({username: credentials.username, password: credentials.password}))
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your HTW account</h2>
        </div>
        <SignInForm loading={loading} errorMessage={error} onSubmit={onSubmit} />
    </div>
  </UserLayout>
  );
}

export default SignInView;
