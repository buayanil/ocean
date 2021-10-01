import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query'

import { store } from './redux/store';
import RootView from './views';


const App: React.FC = () => {
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
