import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { setAuthorization, validateToken } from '../../api/client';
import { CrendentialProperties, UserProperties } from '../../types/models'


interface UserState {
  token?: string;
  user?: UserProperties,
  loading: boolean,
  error?: string,
}

const restoreInitialState = (): UserState => {
  const token = localStorage.getItem('token');
  if (token !== null && validateToken(token)) {
    setAuthorization(token);
    return {token: token, loading: false}
  }
  return {loading: false}
}


const initialState: UserState = restoreInitialState()

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    loginStart: (state, _action: PayloadAction<CrendentialProperties>) => {
      state.loading = true;
      state.error = undefined;
      state.user = undefined;
      state.token = undefined;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      setAuthorization(action.payload);
      localStorage.setItem('token', action.payload)
      state.loading = false;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    getUserStart: (state) => {
      state.loading = true;
      state.error = undefined;
      state.user = undefined;
    },
    getUserSuccess: (state, action: PayloadAction<UserProperties>) => {
      state.user = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    getUserFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.loading = true;
      localStorage.removeItem('token');
      setAuthorization('');
      state.token = undefined;
      state.user = undefined;
      state.error = undefined;
      state.loading = false;
    },
  },
})

export const { loginStart, loginSuccess, loginFailed, getUserStart, getUserSuccess, getUserFailed, logout } = userSlice.actions

export default userSlice.reducer