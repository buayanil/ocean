import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";
import * as yup from 'yup';

import { login } from "../../api/userApi";
import { CrendentialProperties } from "../../types/models";
import { loginFailed, loginStart, loginSuccess } from "../slices/userSlice";


export function* loginAsync({ payload }: PayloadAction<CrendentialProperties>) {
    try {
        const response: SagaReturnType<typeof login> = yield call(login, payload);
        if (response.status === 200) {
            let tokenSchema = yup.string().required()
            try {
                const token = tokenSchema.validateSync(response.data);
                yield put(loginSuccess(token))
            } catch (parseError) {
                yield put(loginFailed(parseError.toString()))
            }
        } 
    } catch (networkError) {
        let errorSchema = yup.object({
            errors: yup.array().required().of(
              yup.object({
                code: yup.string().required(),
                message: yup.string().required(),
              }),
            ),
        });
        try {
            const data = errorSchema.validateSync(networkError.response.data);
            if (data.errors && data.errors[0]) {
                yield put(loginFailed(data.errors[0].message))
            } else {
                yield put(loginFailed(networkError.toString()))
            }
            
        } catch (parseError) {
            yield put(loginFailed(parseError.toString()))
        }

    }    
}
  
export default function* authSaga() {
    yield takeLatest(loginStart.type, loginAsync);
}