import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";

import { errorSchema } from "../../api/client";
import { UserClient, UserValidation } from "../../api/userClient";
import {
  getUserFailed,
  getUserStart,
  getUserSuccess,
  loginFailed,
  loginStart,
  loginSuccess,
  logout,
} from "../slices/userSlice";
import { CrendentialProperties } from "../../types/models";

export function* loginAsync({ payload }: PayloadAction<CrendentialProperties>) {
  try {
    const response: SagaReturnType<typeof UserClient.login> = yield call(
      UserClient.login,
      payload
    );
    if (response.status === 200) {
      try {
        const { token } = UserValidation.tokenSchema.validateSync(
          response.data
        );
        yield put(loginSuccess(token));
      } catch (parseError) {
        yield put(loginFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    try {
      const data = errorSchema.validateSync(networkError.response.data);
      if (data.errors && data.errors[0]) {
        yield put(loginFailed(data.errors[0].message));
      } else {
        yield put(loginFailed(networkError.toString()));
      }
    } catch (parseError) {
      yield put(loginFailed(parseError.toString()));
    }
  }
}

export function* getUserAsync() {
  try {
    const response: SagaReturnType<typeof UserClient.getUser> = yield call(
      UserClient.getUser
    );
    if (response.status === 200) {
      try {
        const user = UserValidation.userSchema.validateSync(response.data);
        yield put(getUserSuccess(user));
      } catch (parseError) {
        yield put(getUserFailed(parseError.toString()));
      }
    }
  } catch (networkError) {
    if (networkError.response.status === 401) {
      // HINT: token expired
      yield put(logout());
    }
    yield put(getUserFailed(networkError.toString()));
  }
}

export default function* authSaga() {
  yield takeLatest(loginStart.type, loginAsync);
  yield takeLatest(getUserStart.type, getUserAsync);
}
