import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserProperties } from "../../../types/user";

interface UserState {
  user?: UserProperties;
  users: UserProperties[];
  loading: boolean;
  error?: string;
  isLoadingGetUsers: boolean;
}

const initialState: UserState = { loading: false, users:[], isLoadingGetUsers: false };

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
    getUsersStart: (state) => {
      state.isLoadingGetUsers = true;
      state.error = undefined;
      state.users = [];
    },
    getUsersSuccess: (state, { payload }: PayloadAction<UserProperties[]>) => {
      state.users = payload;
      state.error = undefined;
      state.isLoadingGetUsers = false;
    },
    getUsersFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoadingGetUsers = false;
    },
  },
});

export const { getUserStart, getUserSuccess, getUserFailed, getUsersStart, getUsersSuccess, getUsersFailed } =
  userSlice.actions;

export default userSlice.reducer;
