import { combineReducers } from "@reduxjs/toolkit";
import databaseSlice from "./slices/databaseSlice";
import userSlice from "./slices/userSlice";

const dataReducer = combineReducers({
  database: databaseSlice,
});

const sessionReducer = combineReducers({
  user: userSlice,
});

export const rootReducer = combineReducers({
  data: dataReducer,
  session: sessionReducer,
  // HINT: control: controlReducer,
});
