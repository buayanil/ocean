import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas/sagas';
import userSlice from './slices/userSlice'

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        user: userSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch