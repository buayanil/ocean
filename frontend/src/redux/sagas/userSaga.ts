import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeLatest } from "redux-saga/effects";

import { CrendentialProperties, UserProperties } from "../../types/models";
import { loginStart, loginSuccess } from "../slices/userSlice";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export function* loginAsync({ payload }: PayloadAction<CrendentialProperties>) {
    yield delay(1000)
    const userMock: UserProperties = {
        id: 1,
        username: 'u',
        firstName: 'f',
        lastName: 'l',
        mail: 'm',
        employeeType: 'e',
    }
    yield put(loginSuccess(userMock))
}
  
export default function* authSaga() {
    yield takeLatest(loginStart.type, loginAsync);
}