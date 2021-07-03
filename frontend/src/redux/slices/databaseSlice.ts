import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DatabaseProperties, StoreStatus } from '../../types/models';


interface DatabaseState {
  databases: DatabaseProperties[],
  loading: boolean,
  error?: string,
  status: StoreStatus,
}

const initialState: DatabaseState = {
    databases: [],
    loading: false,
    status: StoreStatus.PARTIALLY_LOADED,
}

export const databaseSlice = createSlice({
  name: 'databaseSlice',
  initialState,
  reducers: {
    getDatabasesStart: (state) => {
      state.loading = true;
      state.error = undefined;
      state.databases = [];
      state.status = StoreStatus.PARTIALLY_LOADED;
    },
    getDatabasesSuccess: (state, {payload}: PayloadAction<DatabaseProperties[]>) => {
      state.databases = payload
      state.error = undefined;
      state.loading = false;
      state.status = StoreStatus.FULLY_LOADED;
    },
    getDatabasesFailed: (state, {payload}: PayloadAction<string>) => {
      state.error = payload;
      state.databases = [];
      state.loading = false;
      state.status = StoreStatus.PARTIALLY_LOADED;
    },
  },
})

export const {getDatabasesStart, getDatabasesSuccess, getDatabasesFailed} = databaseSlice.actions

export default databaseSlice.reducer