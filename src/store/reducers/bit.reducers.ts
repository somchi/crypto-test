import {
  addDepths,
  addTotalToOrder,
  compareBitOrders,
  getMaxTotalSum,
} from '../../utils/helper';
import { PayloadAction, createSlice, current } from '@reduxjs/toolkit';
import { AppStore } from '../../utils/bit-types';
import { ORDER_TYPE } from '../../utils/constants';

const InitialState: AppStore = {
  rawBids: [] as any[],
  rawAsks: [] as any[],
  bids: [] as any[],
  asks: [] as any[],
  loading: false,
  maxTotalAsks: 0,
  maxTotalBids: 0,
};

export const bitSlice = createSlice({
  name: 'bit',
  initialState: InitialState,
  reducers: {
    setRawBid: (state: AppStore, actions: PayloadAction<any[]>) => {
      const currBids = actions.payload;
      const bids = addTotalToOrder(currBids, ORDER_TYPE.BID);
      const max = getMaxTotalSum(bids);
      const bidDepth = addDepths(bids, max);
      state.maxTotalBids = max;
      state.rawBids = currBids;
      state.bids = bidDepth;
    },
    setRawAsks: (state: AppStore, actions: PayloadAction<any[]>) => {
      const currAsks = actions.payload;
      const asks = addTotalToOrder(currAsks, ORDER_TYPE.ASK);
      const max = getMaxTotalSum(asks);
      const askDepth = addDepths(asks, max);

      state.maxTotalAsks = max;
      state.asks = askDepth;
      state.rawAsks = currAsks;
    },
    setBitBids: (state: AppStore, actions: PayloadAction<any[]>) => {
      const currBids = actions.payload;
      const updateBids = compareBitOrders(current(state).bids, currBids);
      const bids = addTotalToOrder(updateBids, ORDER_TYPE.BID);
      const max = getMaxTotalSum(bids);
      const bidDepth = addDepths(bids, current(state).maxTotalBids);

      state.maxTotalBids = max;
      state.bids = bidDepth;
    },
    setBitAsks: (state: AppStore, actions: PayloadAction<any[]>) => {
      const currAsks = actions.payload;
      const updateAsks = compareBitOrders(current(state).asks, currAsks);
      const asks = addTotalToOrder(updateAsks, ORDER_TYPE.ASK);
      const max = getMaxTotalSum(asks);
      const askDepth = addDepths(asks, max);

      state.maxTotalAsks = max;
      state.asks = askDepth;
    },
    setLoading: (state: AppStore, actions: PayloadAction<boolean>) => {
      state.loading = actions.payload;
    },
    clearState: (state: AppStore) => {
      state.asks = [];
      state.bids = [];
      state.maxTotalAsks = 0;
      state.maxTotalBids = 0;
    },
  },
});

export const {
  setBitBids,
  setBitAsks,
  setRawBid,
  setRawAsks,
  setLoading,
  clearState,
} = bitSlice.actions;
