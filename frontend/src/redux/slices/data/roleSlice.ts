import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  RoleProperties,
  UpstreamCreateRoleProperties,
} from "../../../types/role";

interface RoleState {
  roles: RoleProperties[];
  isLoadingRoles: boolean;
  isLoadingCreateRole: boolean;
  error?: string;
}

const initialState: RoleState = {
  roles: [],
  isLoadingRoles: false,
  isLoadingCreateRole: false,
};

export const databaseSlice = createSlice({
  name: "databaseSlice",
  initialState,
  reducers: {
    getRolesForDatabaseStart: (state, _action: PayloadAction<number>) => {
      state.isLoadingRoles = true;
      state.error = undefined;
      state.roles = [];
    },
    getRolesForDatabaseSuccess: (
      state,
      { payload }: PayloadAction<RoleProperties[]>
    ) => {
      state.roles = payload;
      state.error = undefined;
      state.isLoadingRoles = false;
    },
    getRolesForDatabaseFailed: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.roles = [];
      state.isLoadingRoles = false;
    },
    createRoleForDatabaseStart: (
      state,
      _action: PayloadAction<UpstreamCreateRoleProperties>
    ) => {
      state.error = undefined;
      state.isLoadingCreateRole = true;
    },
    createRoleForDatabaseSuccess: (
      state,
      { payload }: PayloadAction<RoleProperties>
    ) => {
      state.error = undefined;
      state.roles.push(payload);
      state.isLoadingCreateRole = false;
    },
    createRoleForDatabaseFailed: (
      state,
      { payload }: PayloadAction<string>
    ) => {
      state.error = payload;
      state.isLoadingCreateRole = false;
    },
  },
});

export const {
  getRolesForDatabaseStart,
  getRolesForDatabaseSuccess,
  getRolesForDatabaseFailed,
  createRoleForDatabaseStart,
  createRoleForDatabaseSuccess,
  createRoleForDatabaseFailed,
} = databaseSlice.actions;

export default databaseSlice.reducer;
