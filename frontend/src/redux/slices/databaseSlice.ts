import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DatabaseProperties,
  StoreStatus,
  UpstreamDatabaseProperties,
} from "../../types/models";

interface DatabaseState {
  databases: DatabaseProperties[];
  loading: boolean;
  error?: string;
  status: StoreStatus;
}

const initialState: DatabaseState = {
  databases: [],
  loading: false,
  status: StoreStatus.PARTIALLY_LOADED,
};

export const databaseSlice = createSlice({
  name: "databaseSlice",
  initialState,
  reducers: {
    getDatabasesStart: (state) => {
      state.loading = true;
      state.error = undefined;
      state.databases = [];
      state.status = StoreStatus.PARTIALLY_LOADED;
    },
    getDatabasesSuccess: (
      state,
      { payload }: PayloadAction<DatabaseProperties[]>
    ) => {
      state.databases = payload;
      state.error = undefined;
      state.loading = false;
      state.status = StoreStatus.FULLY_LOADED;
    },
    getDatabasesFailed: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.databases = [];
      state.loading = false;
      state.status = StoreStatus.PARTIALLY_LOADED;
    },
    getDatabaseStart: (state, _action: PayloadAction<number>) => {
      state.error = undefined;
      state.loading = true;
    },
    getDatabaseSuccess: (
      state,
      { payload }: PayloadAction<DatabaseProperties>
    ) => {
      state.error = undefined;
      state.databases = state.databases.filter(
        (database) => database.id !== payload.id
      );
      state.databases.push(payload);
      state.loading = false;
    },
    getDatabaseFailed: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.loading = false;
    },
    createDatabaseStart: (
      state,
      _action: PayloadAction<UpstreamDatabaseProperties>
    ) => {
      state.error = undefined;
      state.loading = true;
    },
    createDatabaseSuccess: (
      state,
      { payload }: PayloadAction<DatabaseProperties>
    ) => {
      state.error = undefined;
      state.databases.push(payload);
      state.loading = false;
    },
    createDatabaseFailed: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.loading = false;
    },
    deleteDatabaseStart: (state, _action: PayloadAction<number>) => {
      state.error = undefined;
      state.loading = true;
    },
    deleteDatabaseSuccess: (state, { payload }: PayloadAction<number>) => {
      state.error = undefined;
      state.databases = state.databases.filter(
        (database) => database.id !== payload
      );
      state.loading = false;
    },
    deleteDatabaseFailed: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const {
  getDatabasesStart,
  getDatabasesSuccess,
  getDatabasesFailed,
  getDatabaseStart,
  getDatabaseSuccess,
  getDatabaseFailed,
  createDatabaseStart,
  createDatabaseSuccess,
  createDatabaseFailed,
  deleteDatabaseStart,
  deleteDatabaseSuccess,
  deleteDatabaseFailed,
} = databaseSlice.actions;

export default databaseSlice.reducer;
