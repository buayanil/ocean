import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserProperties } from "../../../types/models";

interface UserState {
  user?: UserProperties;
  loading: boolean;
  error?: string;
}

const initialState: UserState = { loading: false };

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
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
  },
});

export const { getUserStart, getUserSuccess, getUserFailed } =
  userSlice.actions;

export default userSlice.reducer;
