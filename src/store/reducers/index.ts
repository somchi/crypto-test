import { combineReducers } from '@reduxjs/toolkit';
import { appSlice } from './app.reducers';

export const reducers = combineReducers({
  app: appSlice.reducer,
});
