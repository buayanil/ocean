import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas/sagas';
import databaseSlice from './slices/databaseSlice';
import userSlice from './slices/userSlice'

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        user: userSlice,
        database: databaseSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch