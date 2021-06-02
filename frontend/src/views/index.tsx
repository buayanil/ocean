import React, { Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

const OverviewView = React.lazy(() => import('./overview'));
const DatabasesView = React.lazy(() => import('./databases'));
const SettingsView = React.lazy(() => import('./settings'));


const RootView: React.FC = () => (
    <Suspense fallback={<div className="loading" />}>
        <Router>
            <Switch>
                <Redirect exact from="/" to={"overview"} />
                <Route path='/overview' render={(props) => <OverviewView {...props} />} />
                <Route path='/databases' render={(props) => <DatabasesView {...props} />} />
                <Route path='/settings' render={(props) => <SettingsView {...props} />} />
                <Redirect to="/error" />
            </Switch>
        </Router>
    </Suspense>
);

export default RootView;