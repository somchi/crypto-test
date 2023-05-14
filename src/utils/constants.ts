import { env } from 'process';

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

export const ORDERBOOK_LEVELS = 20;

export const WebSocketUrl = 'wss://api.0x.org/orderbook/v1';

export const RequestId = '123e4567-e89b-12d3-a456-426655440000';
