import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./slices/data/userSlice";
import sessionSlice from "./slices/session/sessionSlice";

const dataReducer = combineReducers({
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
