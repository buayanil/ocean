import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";

import { logout } from "../slices/userSlice";
import { databasesSchema, getDatabases } from "../../api/databaseApi";
import { getDatabasesFailed, getDatabasesStart, getDatabasesSuccess } from "../slices/databaseSlice";


export function* getDatabasesAsync() {
    try {
        const response: SagaReturnType<typeof getDatabases> = yield call(getDatabases);
        if (response.status === 200) {
            try {
                const databases = databasesSchema.validateSync(response.data);
                if (databases) {
                    yield put(getDatabasesSuccess(databases))
                } else {
                    // TODO: fix database schema
                    yield put(getDatabasesFailed("Error"))
                }
            } catch (parseError) {
                yield put(getDatabasesFailed(parseError.toString()))
            }
        } 
    } catch (networkError) {
        if (networkError.response.status === 401) {
            // HINT: token expired
            yield put(logout())
        }  
        yield put(getDatabasesFailed(networkError.toString()))
    }
}
  
export default function* databaseSaga() {
    yield takeLatest(getDatabasesStart.type, getDatabasesAsync);
}