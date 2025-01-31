import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes, Outlet,
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
const ReportingView = React.lazy(() => import("./ReportingView"));
const SettingsView = React.lazy(() => import("./SettingsView"));
const FAQView = React.lazy(() => import("./FAQView"));
const PageNotFoundView = React.lazy(() => import("./PageNotFoundView"));

const RootView: React.FC = () => {
  const { isLoggedIn } = useAppSelector((state) => state.session.session);

  return (
    <Router>
      <Suspense fallback={<LoadingView />}>
        <Routes>
          {/* Redirect root to login or overview */}
          <Route path="/" element={<Navigate to={isLoggedIn ? "/overview" : "/login"} />} />

          {/* Public route */}
          <Route path="/login" element={<SignInView />} />

          {/* Protected routes wrapped in one `ProtectedRoute` */}
          <Route element={<ProtectedRoute />}>
            <Route path="/overview" element={<OverviewView />} />
            <Route path="/databases" element={<DatabasesView />} />
            <Route path="/overview/databases" element={<DatabasesView />} />
            <Route path="/databases/new" element={<CreateDatabaseView />} />
            <Route path="/overview/databases/new" element={<CreateDatabaseView />} />
            <Route path="/databases/:id" element={<DatabaseDetailView />} />
            <Route path="/reporting" element={<ReportingView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/overview/settings" element={<SettingsView />} />
            <Route path="/faq" element={<FAQView />} />
          </Route>

          {/* Move `/error` outside of `ProtectedRoute` */}
          <Route path="/error" element={<PageNotFoundView />} />

          {/* Catch-all redirect to error page */}
          <Route path="*" element={<Navigate to="/error" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

const ProtectedRoute = () => {
  const { isLoggedIn } = useAppSelector((state) => state.session.session);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default RootView;
