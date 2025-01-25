import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { store } from './redux/store';
import RootView from './views';
import { restoreSession } from './redux/slices/session/sessionSlice';

// Create a QueryClient instance
const queryClient = new QueryClient();

const App: React.FC = () => {
    // Dispatch session restoration on mount
    useEffect(() => {
        store.dispatch(restoreSession());
    }, []);

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <RootView />
            </QueryClientProvider>
        </Provider>
    );
};

export default App;
