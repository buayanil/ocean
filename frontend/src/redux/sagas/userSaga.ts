import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";

import {
  loginFailed,
  loginStart,
  loginSuccess,
  logout,
  restoreSession,
} from "../slices/session/sessionSlice";
import { CredentialProperties } from "../../types/models";
import { SessionApi, TokensReturn } from "../../api/sessionApi";
import { setBearerToken } from "../../api/client";
import { UserClient } from "../../api/userClient";

export function* loginAsync({ payload }: PayloadAction<CredentialProperties>) {
  // Get tokens for crendentials
  let response: TokensReturn;
  try {
    response = yield call(SessionApi.login, payload);
  } catch (error) {
    yield put(loginFailed((error as Error).message));
    return;
  }
  const { accessToken, refreshToken } = response;

  // Distribute accessToken and refreshToken to localStorage and axios
  setBearerToken(accessToken);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  yield put(loginSuccess());
}

export function* restoreSessionAsync() {
  // Restore access Token
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken === null) {
    yield put(logout());
    return;
  }

  // Initiate axios interceptor
  setBearerToken(accessToken);
  try {
    yield call(UserClient.getUser);
    yield put(loginSuccess());
  } catch (error) {
    yield put(logout());
  }
}

export function* logoutAsync() {
  setBearerToken("");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  yield call;
}

export default function* authSaga() {
  yield takeLatest(loginStart.type, loginAsync);
  yield takeLatest(restoreSession.type, restoreSessionAsync);
  yield takeLatest(logout.type, logoutAsync);
}
