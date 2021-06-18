import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CrendentialProperties, UserProperties } from '../../types/models'


interface UserState {
  token?: string;
  user?: UserProperties,
  loading: boolean,
  error?: string,
}

const initialState: UserState = {
  loading: false,
}

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    loginStart: (state, action: PayloadAction<CrendentialProperties>) => {
      state.loading = true;
      state.error = undefined;
      state.user = undefined;
      state.token = undefined;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.loading = false;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
})

export const { loginStart, loginSuccess, loginFailed } = userSlice.actions

export default userSlice.reducer