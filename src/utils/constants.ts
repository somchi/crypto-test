export const DEFAULT_CURRENCIES = [
  'ethereum',
  'bitcoin',
  'binancecoin',
  'usd-coin',
  'dogecoin',
  'solana',
];

export enum CURRENCIES {
  USD = 'usd',
}

export enum PAIRNAMES {
  BASE,
  QUOTE,
}

export enum ORDER_TYPE {
  BID,
  ASK,
}

export const ORDERBOOK_LEVELS = 25;

export const WebSocketUrl = 'wss://api.0x.org/orderbook/v1';

export const Pair = ['WETH/DAI', 'USDT/UDSC'];

export const RequestId = '123e4567-e89b-12d3-a456-426655440000';
export const Symbol = 'tBTCUSD';
export const EventName = 'subscribe';
export const Channel = 'book';

export const PRECISION = {
  '0': 5,
  '1': 4,
  '2': 3,
  '3': 2,
  '4': 1,
};

export enum FREQUENCY {
  F0 = 'F0',
  F1 = 'F1',
}
