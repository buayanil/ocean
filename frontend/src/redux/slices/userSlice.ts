import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../store'
import { CrendentialProperties, UserProperties } from '../../types/models'


interface UserState {
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
      state.error = undefined;
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<UserProperties>) => {
      state.user = action.payload;
      state.loading = false;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
})

export const { loginStart, loginSuccess, loginFailed } = userSlice.actions

export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer