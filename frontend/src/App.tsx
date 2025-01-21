import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { store } from './redux/store';
import RootView from './views';
import { restoreSession } from './redux/slices/session/sessionSlice';


const App: React.FC = () => {
  useEffect(() => {
    store.dispatch(restoreSession());
  }, []);

  const queryClient = new QueryClient()
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RootView />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
