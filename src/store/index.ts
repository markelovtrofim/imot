import { configureStore, combineReducers } from '@reduxjs/toolkit';

import langReducer from './reducers/langReducer';
import {authSlice} from "./reducers/auth.slice";

const rootReducer = combineReducers({
  lang: langReducer,
  auth: authSlice.reducer
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
