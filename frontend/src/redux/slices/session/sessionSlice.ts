import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setAuthorization, validateToken } from "../../../api/client";
import { CredentialProperties } from "../../../types/models";

interface UserState {
  token?: string;
  loading: boolean;
  error?: string;
}

const restoreInitialState = (): UserState => {
  const token = localStorage.getItem("token");
  if (token !== null && validateToken(token)) {
    setAuthorization(token);
    return { token: token, loading: false };
  }
  localStorage.removeItem("token");
  setAuthorization("");
  return { loading: false };
};

const initialState: UserState = restoreInitialState();

export const sessionSlice = createSlice({
  name: "sessionSlice",
  initialState,
  reducers: {
    loginStart: (state, _action: PayloadAction<CredentialProperties>) => {
      state.loading = true;
      state.error = undefined;
      state.token = undefined;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      setAuthorization(action.payload);
      localStorage.setItem("token", action.payload);
      state.loading = false;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.loading = true;
      localStorage.removeItem("token");
      setAuthorization("");
      state.token = undefined;
      state.error = undefined;
      state.loading = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailed, logout } =
  sessionSlice.actions;

export default sessionSlice.reducer;
