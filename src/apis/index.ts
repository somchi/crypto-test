import { CURRENCIES, DEFAULT_CURRENCIES } from '../utils/constants';
import { generateUrl } from '../utils/helper-old';
import { PairPrice } from '../utils/types';

const baseURL = 'https://api.coingecko.com/api/v3';
const oxBaseURL = 'https://api.0x.org';

export const getInitialAssests = async () => {
  let assets: any = [];
  const url = generateUrl(`${baseURL}/coins/markets`, {
    vs_currency: CURRENCIES.USD,
    ids: DEFAULT_CURRENCIES,
  });
  const response = await fetch(url);
  assets = await response.json();
  return assets;
};

export const getCurrentAssestPrice = async (assetId: string) => {
  let assets: any = [];
  const url = generateUrl(`${baseURL}/simple/price`, {
    ids: assetId,
    vs_currencies: CURRENCIES.USD,
  });
  const response = await fetch(url);
  assets = await response.json();
  return assets;
};

export const getTokenPrice = async (assetId: string, tokenAddress: string) => {
  let assets: any = [];
  const url = generateUrl(`${baseURL}/simple/token_price/${assetId}`, {
    id: assetId,
    vs_currencies: CURRENCIES.USD,
    contract_addresses: tokenAddress,
    include_market_cap: true,
    include_24hr_change: true,
  });

  const response = await fetch(url);
  assets = await response.json();
  return assets;
};

export const getAssest = async (assetId: string) => {
  let assets: any = [];
  const url = generateUrl(`${baseURL}/coins/markets`, {
    vs_currency: CURRENCIES.USD,
    ids: assetId,
  });
  const response = await fetch(url);
  assets = await response.json();
  return assets;
};

export const getPairPrice = async (data: PairPrice) => {
  const amount = data.amount * 10 ** data.decimal;
  const url = generateUrl(`${oxBaseURL}/swap/v1/price`, {
    ...data,
    sellAmount: amount,
  });
  const response = await fetch(url);
  const swapPrice = await response.json();

  const price = swapPrice.buyAmount / 10 ** data.decimal;
  return price;
};

export const getOrderBook = async (baseToken: string, quoteToken: string) => {
  const url = generateUrl(`${oxBaseURL}/orderbook/v1`, {
    quoteToken,
    baseToken,
  });
  const response = await fetch(url, {
    headers: { '0x-api-key': '34d20cc8-82a7-47bc-99e1-a82581f20000' },
  });
  const orderbook = await response.json();
  return orderbook;
};
