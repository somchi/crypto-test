import { addTotalToOrder, compareOrders, formatBidsData } from '@/utils/helper';
import { AppStore, Order } from '@/utils/types';
import { PayloadAction, createSlice, current } from '@reduxjs/toolkit';

const initialState: AppStore = {
  selectedAsset: {} as any,
  orderBook: {} as any,
  bids: [] as Order[],
  asks: [] as Order[],
  prevBids: [] as Order[],
  prevAsks: [] as Order[],
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedAsset: (state: AppStore, actions: PayloadAction<any>) => {
      state.selectedAsset = actions.payload;
    },
    setOrderBook: (state: AppStore, actions: PayloadAction<any>) => {
      state.orderBook = actions.payload;
    },
    setBids: (state: AppStore, actions: PayloadAction<Order[]>) => {
      const currBids = actions.payload;
      const updateBids = compareOrders(state.bids, currBids);
      const bids = addTotalToOrder(updateBids);
      state.bids = bids;
    },
    setAsks: (state: AppStore, actions: PayloadAction<Order[]>) => {
      const currAsks = actions.payload;
      const updateAsks = compareOrders(current(state.asks), currAsks);
      const asks = addTotalToOrder(updateAsks);
      state.asks = asks;
    },
    clearState: (state: AppStore) => {
      state.bids = [];
      state.asks = [];
    },
  },
});

export const { setSelectedAsset, setOrderBook, setAsks, setBids, clearState } =
  appSlice.actions;
export default appSlice.reducer;
