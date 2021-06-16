import React from 'react';

import SignInForm from '../components/SignInForm';
import UserLayout from '../layouts/UserLayout';


interface SignInViewProps {}

const SignInView: React.FC<SignInViewProps> = () => {
  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your HTW account</h2>
        </div>
        <SignInForm />
    </div>
  </UserLayout>
  );
}

export default SignInView;
