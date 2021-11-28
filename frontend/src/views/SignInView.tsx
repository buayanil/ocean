import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { OverviewNavigation } from "../constants/menu.";
import { CredentialProperties } from "../types/models";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { loginStart } from "../redux/slices/session/sessionSlice";

import UserLayout from "../layouts/UserLayout";
import SignInForm from "../components/SignInForm";

interface SignInViewProps { }

const SignInView: React.FC<SignInViewProps> = () => {
  const history = useHistory();
  const { loading, error, isLoggedIn } = useAppSelector(
    (state) => state.session.session
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedIn === true) {
      // HINT: Already signed in
      history.push(OverviewNavigation.to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const onSubmit = (credentials: CredentialProperties) => {
    dispatch(loginStart(credentials));
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your HTW account
          </h2>
        </div>
        <SignInForm
          loading={loading}
          errorMessage={error}
          onSubmit={onSubmit}
        />
      </div>
    </UserLayout>
  );
};

export default SignInView;
