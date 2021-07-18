import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

import { logout } from "../slices/userSlice";
import { DatabaseClient, DatabaseValidation } from "../../api/databaseClient";
import {
  createDatabaseFailed,
  createDatabaseStart,
  createDatabaseSuccess,
  deleteDatabaseFailed,
  deleteDatabaseStart,
  deleteDatabaseSuccess,
  getDatabaseFailed,
  getAllDatabasesFailed,
  getAllDatabasesStart,
  getAllDatabasesSuccess,
  getDatabaseStart,
  getDatabaseSuccess,
} from "../slices/databaseSlice";
import { UpstreamDatabaseProperties } from "../../types/models";
import { errorSchema } from "../../api/client";

export function* getAllDatabasesAsync() {
  try {
    const response: SagaReturnType<typeof DatabaseClient.getAllDatabases> =
      yield call(DatabaseClient.getAllDatabases);
    if (response.status === 200) {
      try {
        const databases = DatabaseValidation.getAllDatabasesSchema.validateSync(
          response.data
        );
        if (databases) {
          yield put(getAllDatabasesSuccess(databases));
        } else {
          // TODO: fix database schema
          yield put(getAllDatabasesFailed("Error"));
        }
      } catch (parseError) {
        yield put(getAllDatabasesFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    if (networkError.response.status === 401) {
      // HINT: token expired
      yield put(logout());
    }
    yield put(getAllDatabasesFailed(networkError.toString()));
  }
}

export function* getDatabaseAsync({ payload }: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof DatabaseClient.getDatabase> =
      yield call(DatabaseClient.getDatabase, payload);
    if (response.status === 200) {
      try {
        const database = DatabaseValidation.getDatabaseSchema.validateSync(
          response.data
        );
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
    const response: SagaReturnType<typeof DatabaseClient.createDatabase> =
      yield call(DatabaseClient.createDatabase, payload);
    if (response.status === 200) {
      try {
        const database = DatabaseValidation.createDatabaseSchema.validateSync(
          response.data
        );
        yield put(createDatabaseSuccess(database));
      } catch (parseError) {
        yield put(createDatabaseFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    if (networkError.response.status === 401) {
      // HINT: token expired
      yield put(logout());
    } else {
      try {
        const data = errorSchema.validateSync(networkError.response.data);
        if (data.errors && data.errors[0]) {
          yield put(createDatabaseFailed(data.errors[0].message));
        } else {
          yield put(createDatabaseFailed(networkError.toString()));
        }
      } catch (parseError) {
        yield put(createDatabaseFailed(parseError.toString()));
      }
    }
  }
}

export function* deleteDatabaseAsync({ payload }: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof DatabaseClient.deleteDatabase> =
      yield call(DatabaseClient.deleteDatabase, payload);
    if (response.status === 200) {
      try {
        DatabaseValidation.deleteDatabaseSchema.validateSync(response.data);
        yield put(deleteDatabaseSuccess(payload));
      } catch (parseError) {
        yield put(deleteDatabaseFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    if (networkError.response.status === 401) {
      // HINT: token expired
      yield put(logout());
    } else {
      try {
        const data = errorSchema.validateSync(networkError.response.data);
        if (data.errors && data.errors[0]) {
          yield put(deleteDatabaseFailed(data.errors[0].message));
        } else {
          yield put(deleteDatabaseFailed(networkError.toString()));
        }
      } catch (parseError) {
        yield put(deleteDatabaseFailed(parseError.toString()));
      }
    }
  }
}

export default function* databaseSaga() {
  yield takeLatest(getAllDatabasesStart.type, getAllDatabasesAsync);
  yield takeLatest(getDatabaseStart.type, getDatabaseAsync);
  yield takeLatest(createDatabaseStart.type, createDatabaseAsync);
  yield takeLatest(deleteDatabaseStart.type, deleteDatabaseAsync);
}
