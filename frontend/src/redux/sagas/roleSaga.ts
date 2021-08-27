import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

import { UpstreamCreateRoleProperties } from "../../types/role";
import { errorSchema } from "../../api/client";
import { RoleClient, RoleValidation } from "../../api/roleClient";
import { logout } from "../slices/session/sessionSlice";
import {
  getRolesForDatabaseSuccess,
  getRolesForDatabaseFailed,
  getRolesForDatabaseStart,
  createRoleForDatabaseSuccess,
  createRoleForDatabaseFailed,
  createRoleForDatabaseStart,
  deleteRoleForDatabaseSuccess,
  deleteRoleForDatabaseFailed,
  deleteRoleForDatabaseStart,
} from "../slices/data/roleSlice";

export function* getRolesForDatabaseAsync({ payload }: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof RoleClient.getRolesForDatabase> =
      yield call(RoleClient.getRolesForDatabase, payload);
    if (response.status === 200) {
      console.log(response);
      try {
        const roles = RoleValidation.getRolesForDatabaseSchema.validateSync(
          response.data
        );
        if (roles) {
          yield put(getRolesForDatabaseSuccess(roles));
        } else {
          // TODO: fix roles schema
          yield put(getRolesForDatabaseFailed("Error"));
        }
      } catch (parseError) {
        yield put(getRolesForDatabaseFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    if (networkError.response.status === 401) {
      // HINT: token expired
      yield put(logout());
    }
    yield put(getRolesForDatabaseFailed(networkError.toString()));
  }
}

export function* createRoleForDatabaseAsync({
  payload,
}: PayloadAction<UpstreamCreateRoleProperties>) {
  try {
    const response: SagaReturnType<typeof RoleClient.createRoleForDatabase> =
      yield call(RoleClient.createRoleForDatabase, payload);
    if (response.status === 200) {
      try {
        const role = RoleValidation.createRoleForDatabaseSchema.validateSync(
          response.data
        );
        yield put(createRoleForDatabaseSuccess(role));
      } catch (parseError) {
        yield put(createRoleForDatabaseFailed(parseError.toString()));
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
          yield put(createRoleForDatabaseFailed(data.errors[0].message));
        } else {
          yield put(createRoleForDatabaseFailed(networkError.toString()));
        }
      } catch (parseError) {
        yield put(createRoleForDatabaseFailed(parseError.toString()));
      }
    }
  }
}

export function* deleteRoleForDatabaseAsync({
  payload,
}: PayloadAction<number>) {
  try {
    const response: SagaReturnType<typeof RoleClient.deleteRoleForDatabase> =
      yield call(RoleClient.deleteRoleForDatabase, payload);
    if (response.status === 200) {
      try {
        RoleValidation.deleteDatabaseSchema.validateSync(response.data);
        yield put(deleteRoleForDatabaseSuccess(payload));
      } catch (parseError) {
        yield put(deleteRoleForDatabaseFailed(parseError.toString()));
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
          yield put(deleteRoleForDatabaseFailed(data.errors[0].message));
        } else {
          yield put(deleteRoleForDatabaseFailed(networkError.toString()));
        }
      } catch (parseError) {
        yield put(deleteRoleForDatabaseFailed(parseError.toString()));
      }
    }
  }
}

export default function* rolesSaga() {
  yield takeLatest(getRolesForDatabaseStart.type, getRolesForDatabaseAsync);
  yield takeLatest(createRoleForDatabaseStart.type, createRoleForDatabaseAsync);
  yield takeLatest(deleteRoleForDatabaseStart.type, deleteRoleForDatabaseAsync);
}
