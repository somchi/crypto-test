export type Asset = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

export type Order = {
  price: number;
  quantity: number;
  total?: number;
};

export type AppStore = {
  selectedAsset: any;
  orderBook: any;
  bids: Order[];
  asks: Order[];
  prevBids: Order[];
  prevAsks: Order[];
};

export type PairPrice = {
  buyToken: string;
  sellToken: string;
  amount: number;
  decimal: number;
};
