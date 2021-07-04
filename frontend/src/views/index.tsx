import React, { Suspense } from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import SignInView from './SignInView';
import LoadingView from './LoadingView';
import { getUserStart } from '../redux/slices/userSlice';

const OverviewView = React.lazy(() => import('./OverviewView'));
const DatabasesView = React.lazy(() => import('./databases/DatabasesView'));
const CreateDatabaseView = React.lazy(() => import('./databases/CreateDatabaseView'));
const SettingsView = React.lazy(() => import('./SettingsView'));


const RootView: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token && user === undefined) {
      dispatch(getUserStart())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <Router>
      <Suspense fallback={<LoadingView />}>
        <Switch>
          <Redirect exact from="/" to={token ? '/overview' : '/login'} />
          <Route exact path='/login' render={(props) => <SignInView {...props} />} />
          <ProtectedRoute exact path='/overview' render={(props: any) => <OverviewView {...props} />} />
          <ProtectedRoute exact path='/databases' render={(props: any) => <DatabasesView {...props} />} />
          <ProtectedRoute path='/databases/new' render={(props: any) => <CreateDatabaseView {...props} />} />
          <ProtectedRoute path='/settings' render={(props: any) => <SettingsView {...props} />} />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </Router>
  );
}

const ProtectedRoute = (props: any) => {
  const token = useAppSelector((state) => state.user.token);
  return token !== undefined ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: "/login",
      }}
    />
  );
};


export default RootView;