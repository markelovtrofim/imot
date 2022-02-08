import { configureStore, combineReducers } from '@reduxjs/toolkit';

import langReducer from './reducers/langReducer';


const rootReducer = combineReducers({
  lang: langReducer
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
