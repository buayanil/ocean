import { combineReducers } from "@reduxjs/toolkit";
import databaseSlice from "./slices/data/databaseSlice";
import userSlice from "./slices/data/userSlice";
import sessionSlice from "./slices/session/sessionSlice";

const dataReducer = combineReducers({
  database: databaseSlice,
  user: userSlice,
});

const sessionReducer = combineReducers({
  session: sessionSlice,
});

export const rootReducer = combineReducers({
  data: dataReducer,
  session: sessionReducer,
  // HINT: control: controlReducer,
});
