import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";

import { UserClient, UserValidation } from "../../api/userClient";
import {
  loginFailed,
  loginStart,
  loginSuccess,
} from "../slices/session/sessionSlice";
import { CredentialProperties } from "../../types/models";

export function* loginAsync({ payload }: PayloadAction<CredentialProperties>) {
  const response: SagaReturnType<typeof UserClient.login> = yield call(
    UserClient.login,
    payload
  );
  if (response.status === 200) {
    try {
      const { accessToken } = UserValidation.tokenSchema.validateSync(
        response.data
      );
      yield put(loginSuccess(accessToken));
    } catch (parseError) {
      yield put(loginFailed((parseError as Error).toString()));
    }
  } else {
    yield put(loginFailed("Login failed."));
  }
}

export default function* authSaga() {
  yield takeLatest(loginStart.type, loginAsync);
}
