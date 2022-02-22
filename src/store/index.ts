import { configureStore, combineReducers } from '@reduxjs/toolkit';

import langReducer from './lang/langReducer';
import {authSlice} from "./auth/auth.slice";
import {callsSlice} from "./calls/calls.slice";
import {searchSlice} from "./search/search.slice";


const rootReducer = combineReducers({
  lang: langReducer,
  auth: authSlice.reducer,
  calls: callsSlice.reducer,
  search: searchSlice.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
