import { all, fork } from "redux-saga/effects";

import userSaga from "./userSaga";
import databaseSaga from "./databaseSaga";
import rolesSaga from "./roleSaga";

export default function* rootSaga() {
  yield all([fork(userSaga)]);
  yield all([fork(databaseSaga)]);
  yield all([fork(rolesSaga)]);
}
