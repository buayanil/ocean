import React from 'react';
import { Provider } from 'react-redux';

import { store } from './redux/store';
import RootView from './views';


const App: React.FC = () => {
  return (
    <Provider store={store}>
      <RootView />
    </Provider>
  );
}

export default App;
