import { all, fork } from 'redux-saga/effects';

import authSaga from './userSaga';


export default function* rootSaga() {
    yield all([fork(authSaga)])
}