import {configureStore, combineReducers} from '@reduxjs/toolkit';

import {authSlice} from "./auth/auth.slice";
import {callsSlice} from "./calls/calls.slice";
import {searchSlice} from "./search/search.slice";
import {templateSlice} from "./search/template.slice";
import {dictsSlice} from "./dicts/dicts.slice";
import {usersSlice} from "./users/users.slice";
import {langSlice} from "./lang/lang.slice";
import {tagsSlice} from './tags/tags.slice';
import {reportsSlice} from './reports/reports.slice';
import {errorSlice} from "./error/error.slice";


const rootReducer = combineReducers({
  lang: langSlice.reducer,
  auth: authSlice.reducer,
  users: usersSlice.reducer,
  calls: callsSlice.reducer,
  search: searchSlice.reducer,
  template: templateSlice.reducer,
  dicts: dictsSlice.reducer,
  tags: tagsSlice.reducer,
  reports: reportsSlice.reducer,
  error: errorSlice.reducer

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};


export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
