import { combineReducers } from '@reduxjs/toolkit';
import { appSlice } from './app.reducers';
import { bitSlice } from './bit.reducers';

export const reducers = combineReducers({
  app: appSlice.reducer,
  bit: bitSlice.reducer,
});
