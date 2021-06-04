import React, { Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import LoadingView from './LoadingView';

const OverviewView = React.lazy(() => import('./OverviewView'));
const DatabasesView = React.lazy(() => import('./databases/DatabasesView'));
const NewDatabaseView = React.lazy(() => import('./databases/NewDatabaseView'));
const SettingsView = React.lazy(() => import('./SettingsView'));


export interface ViewProps {
    selectedNavigation: string;
}

const RootView: React.FC = () => (
    <Router>
        <Suspense fallback={<LoadingView />}>
            <Switch>
                <Redirect exact from="/" to={"/overview"} />
                <Route exact path='/overview' render={(props) => <OverviewView {...props} />} />
                <Route exact path='/databases' render={(props) => <DatabasesView {...props} />} />
                <Route path='/databases/new' render={(props) => <NewDatabaseView {...props} />} />
                <Route path='/settings' render={(props) => <SettingsView {...props} />} />
                <Redirect to="/error" />
            </Switch>
        </Suspense>
    </Router>
);

export default RootView;