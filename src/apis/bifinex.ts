import { generateUrl } from '../utils/helper-old';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BITFINITX_BASE_URL;

export const getPairOrder = async (pair: string) => {
  // let assets: any = [];
  // const url = generateUrl(`${BASE_URL}/book/t${'APEUSD'}/P0`, {
  //   len: 25,
  // });
  const response = await axios.get('/api/page');
  return response;
};

export const getInitialOrder = async (precision: number) => {
  const url = generateUrl(`${BASE_URL}/book/t${'BTCUSD'}/P${precision}`, {
    len: 25,
  });
  const response = await axios.get(url);
  return response;
};
