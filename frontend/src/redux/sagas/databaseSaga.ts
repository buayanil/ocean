import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

import { logout } from "../slices/userSlice";
import {
  createDatabase,
  createDatabaseSchema,
  databasesSchema,
  deleteDatabase,
  deleteDatabaseSchema,
  getDatabase,
  getDatabases,
  getDatabaseSchema,
} from "../../api/databaseApi";
import {
  createDatabaseFailed,
  createDatabaseStart,
  createDatabaseSuccess,
  deleteDatabaseFailed,
  deleteDatabaseStart,
  deleteDatabaseSuccess,
  getDatabaseFailed,
  getDatabasesFailed,
  getDatabasesStart,
  getDatabasesSuccess,
  getDatabaseStart,
  getDatabaseSuccess,
} from "../slices/databaseSlice";
import { UpstreamDatabaseProperties } from "../../types/models";

export function* getDatabasesAsync() {
  try {
    const response: SagaReturnType<typeof getDatabases> = yield call(
      getDatabases
    );
    if (response.status === 200) {
      try {
        const databases = databasesSchema.validateSync(response.data);
        if (databases) {
          yield put(getDatabasesSuccess(databases));
        } else {
          // TODO: fix database schema
          yield put(getDatabasesFailed("Error"));
        }
      } catch (parseError) {
        yield put(getDatabasesFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    if (networkError.response.status === 401) {
      // HINT: token expired
      yield put(logout());
    }
    yield put(getDatabasesFailed(networkError.toString()));
  }
}

export function* getDatabaseAsync({ payload }: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof getDatabase> = yield call(
      getDatabase,
      payload
    );
    if (response.status === 200) {
      try {
        const database = getDatabaseSchema.validateSync(response.data);
        yield put(getDatabaseSuccess(database));
      } catch (parseError) {
        yield put(getDatabaseFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    if (networkError.response.status === 401) {
      // HINT: token expired
      yield put(logout());
    }
    yield put(getDatabaseFailed(networkError.toString()));
  }
}

export function* createDatabaseAsync({
  payload,
}: PayloadAction<UpstreamDatabaseProperties>) {
  try {
    const response: SagaReturnType<typeof createDatabase> = yield call(
      createDatabase,
      payload
    );
    if (response.status === 200) {
      try {
        const database = createDatabaseSchema.validateSync(response.data);
        yield put(createDatabaseSuccess(database));
      } catch (parseError) {
        yield put(createDatabaseFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    if (networkError.response.status === 401) {
      // HINT: token expired
      yield put(logout());
    }
    yield put(createDatabaseFailed(networkError.toString()));
  }
}

export function* deleteDatabaseAsync({ payload }: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof deleteDatabase> = yield call(
      deleteDatabase,
      payload
    );
    if (response.status === 200) {
      try {
        deleteDatabaseSchema.validateSync(response.data);
        yield put(deleteDatabaseSuccess(payload));
      } catch (parseError) {
        yield put(deleteDatabaseFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    if (networkError.response.status === 401) {
      // HINT: token expired
      yield put(logout());
    }
    yield put(deleteDatabaseFailed(networkError.toString()));
  }
}

export default function* databaseSaga() {
  yield takeLatest(getDatabasesStart.type, getDatabasesAsync);
  yield takeLatest(getDatabaseStart.type, getDatabaseAsync);
  yield takeLatest(createDatabaseStart.type, createDatabaseAsync);
  yield takeLatest(deleteDatabaseStart.type, deleteDatabaseAsync);
}
