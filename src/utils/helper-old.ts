import { ORDERBOOK_LEVELS } from './constants';
import { Order } from './types';

export const generateUrl = (baseUrl: string, params: any) => {
  let url = baseUrl;
  if (params && !isArrayEmpty(params)) {
    const query = Object.keys(params)
      .map((key) => {
        if (params[key] !== '') {
          return `${key}=${params[key]}`;
        }
      })
      .filter((params) => !!params)
      .join('&');
    url = `${baseUrl}?${query}`;
  }

  return url;
};

export const isArrayEmpty = (data: any[]) => {
  if (data?.length === 0) {
    return true;
  }
  return false;
};

export const isStringEmpty = (str: string) => {
  if (str === undefined || str.length === 0) {
    return true;
  }
  return false;
};

export const isObjEmpty = (obj: any) => {
  if (Object.keys(obj || {}).length === 0) {
    return true;
  }
  return false;
};

export const formatCurrency = (currency: number) => {
  const amount = Number(currency).toLocaleString('en-US', {
    currency: 'USD',
    style: 'currency',
    minimumFractionDigits: 3,
  });
  return amount;
};

export const formatPercent = (value: number) => {
  if (value < 0) {
    return `${value.toString()}%`;
  } else {
    return `+${value}%`;
  }
};

export const formatNumber = (value?: number, decimal?: number) => {
  const formatedValue = value?.toFixed(decimal);
  return formatedValue;
};
// bid:
// quoteToken = maker = price;
// baseToken = taker = amount;
// ask:
// quoteToken = taker = price;
// baseToken = maker = amount;

export const formatBidsData = (
  bids: any,
  quoteDecimal: number,
  baseDecimal: number
) => {
  const orders = bids.records.map((item: any) => {
    const quoteQty = item.order.makerAmount / 10 ** quoteDecimal;
    const baseQty = item.order.takerAmount / 10 ** baseDecimal;
    const price = quoteQty / baseQty;

    const quantity = baseQty;

    return {
      price,
      quantity,
    };
  });
  return orders;
};

export const formatAsksData = (
  asks: any,
  quoteDecimal: number,
  baseDecimal: number
) => {
  const orders = asks.records.map((item: any) => {
    const baseUnit = 10 ** baseDecimal;
    const quoteUnit = 10 ** quoteDecimal;
    const quoteQty = item.order.takerAmount / quoteUnit;
    const baseQty = item.order.makerAmount / baseUnit;
    const price = quoteQty / baseQty;

    const quantity = baseQty;
    return {
      price,
      quantity,
    };
  });
  return orders;
};

export const addTotalToOrder = (
  orders: Order[] | { price: number; amount: number }[]
) => {
  const totals: number[] = [];
  return orders.map((order: any, index: number) => {
    const amount: number = order.amount;
    if (order.total !== undefined && Number.isNaN(order.total)) {
      totals.push(order.total);
      return order;
    } else {
      const updatedOrder = { ...order };
      const total: number = index === 0 ? amount : amount + totals[index - 1];
      updatedOrder.total = total;
      totals.push(total);
      return updatedOrder;
    }
  });
};

export const compareOrders = (currentOrders: any[], orders: any[]) => {
  let updatedOrder: any[] = currentOrders;
  // console.log('====', orders);
  orders.forEach((order) => {
    const orderPrice = order.price;
    const orderAmount = order.amount;
    if (orderAmount === 0) {
      updatedOrder = [...updatedOrder].filter(
        (orderLevel) => orderLevel.price !== orderPrice
      );
    } else {
      if (currentOrders.some((currOrder) => currOrder.price === orderPrice)) {
        updatedOrder = [...updatedOrder].map((updateOrder) => {
          if (updateOrder.price === order.price) {
            updateOrder = order;
          }
          return updateOrder;
        });
      } else {
        if (updatedOrder.length < ORDERBOOK_LEVELS) {
          updatedOrder = [...updatedOrder, order];
        }
      }
    }
  });
  return updatedOrder;
};

export const formatBitData = (data: any[]) => {
  const bids = [];
  const asks = [];
  for (let i in data) {
    const book = data[i];
    const price = book[0];
    const count = book[1];
    const amount = book[2];
    if (amount > 0) {
      bids.push({ price, count, amount });
    } else {
      asks.push({ price, count, amount: Math.abs(amount) });
    }
  }
  return { bids, asks };
};

export const formatBitDataOne = (data: any[]) => {
  const bids = [];
  const asks = [];

  const price = data[0];
  const count = data[1];
  const amount = data[2];
  if (amount > 0) {
    bids.push({ price, count, amount });
  } else {
    asks.push({ price, count, amount: Math.abs(amount) });
  }

  return { bids, asks };
};

export const compareBitOrders = (currentOrders: any[], orders: any[]) => {
  let updatedOrder: any[] = currentOrders;
  orders.forEach((order) => {
    const orderPrice = order.price;
    const orderCount = order.count;
    if (orderCount !== 0) {
      if (currentOrders.some((currOrder) => currOrder.price === orderPrice)) {
        updatedOrder = [...updatedOrder].map((updateOrder) => {
          if (updateOrder.price === order.price) {
            updateOrder = order;
          }
          return updateOrder;
        });
      } else {
        if (updatedOrder.length) {
          updatedOrder = [...updatedOrder, order];
        }
      }
    } else {
      updatedOrder = [...updatedOrder].filter(
        (orderLevel) => orderLevel.price !== orderPrice
      );
    }
    // if (orderAmount === 0 && updatedOrder.length > ORDERBOOK_LEVELS) {
    //   updatedOrder = [...updatedOrder].filter(
    //     (orderLevel) => orderLevel.price !== orderPrice
    //   );
    // } else {
    //   if (currentOrders.some((currOrder) => currOrder.price === orderPrice)) {
    //     updatedOrder = [...updatedOrder].map((updateOrder) => {
    //       if (updateOrder.price === order.price) {
    //         updateOrder = order;
    //       }
    //       return updateOrder;
    //     });
    //   } else {
    //     if (updatedOrder.length < ORDERBOOK_LEVELS) {
    //       updatedOrder = [...updatedOrder, order];
    //     }
    //   }
    // }
  });
  return updatedOrder;
};
