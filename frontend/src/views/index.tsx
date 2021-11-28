import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

import SignInView from "./SignInView";
import LoadingView from "./LoadingView";

const OverviewView = React.lazy(() => import("./OverviewView"));
const DatabasesView = React.lazy(() => import("./databases/DatabasesView"));
const CreateDatabaseView = React.lazy(
  () => import("./databases/CreateDatabaseView")
);
const DatabaseDetailView = React.lazy(
  () => import("./databases/DatabaseDetailView")
);
const SettingsView = React.lazy(() => import("./SettingsView"));
const FAQView = React.lazy(() => import("./FAQView"));
const PageNotFoundView = React.lazy(() => import("./PageNotFoundView"));

const RootView: React.FC = () => {
  const { isLoggedIn } = useAppSelector((state) => state.session.session);


  return (
    <Router>
      <Suspense fallback={<LoadingView />}>
        <Switch>
          <Redirect exact from="/" to={isLoggedIn ? "/overview" : "/login"} />
          <Route
            exact
            path="/login"
            render={(props) => <SignInView {...props} />}
          />
          <ProtectedRoute
            exact
            path="/overview"
            render={(props: any) => <OverviewView {...props} />}
          />
          <ProtectedRoute
            exact
            path="/databases"
            render={(props: any) => <DatabasesView {...props} />}
          />
          <ProtectedRoute
            path="/databases/new"
            render={(props: any) => <CreateDatabaseView {...props} />}
          />
          <ProtectedRoute
            exact
            path="/databases/:id"
            render={(props: any) => <DatabaseDetailView {...props} />}
          />
          <ProtectedRoute
            path="/settings"
            render={(props: any) => <SettingsView {...props} />}
          />
          <ProtectedRoute
            path="/faq"
            render={(props: any) => <FAQView {...props} />}
          />
          <Route
            path="/error"
            render={(props: any) => <PageNotFoundView {...props} />}
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </Router>
  );
};

const ProtectedRoute = (props: any) => {
  const { isLoggedIn } = useAppSelector((state) => state.session.session);
  return isLoggedIn ? (
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
