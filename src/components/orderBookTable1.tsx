import { ORDER_TYPE } from '../utils/constants';
import { formatNumber } from '../utils/helper-old';
import { Order } from '../utils/types';
import { memo } from 'react';

type Props = {
  data: Order[];
  orderType: number;
  quoteName: string;
  baseName: string;
};

export const OrderBookTable = memo(function OrderBookTable({
  data,
  orderType,
  quoteName,
  baseName,
}: Props) {
  const renderOrders = () => {
    const sortedOrder: Order[] = [...data].sort((curr: Order, nxt: Order) => {
      let result: number = 0;
      if (orderType === ORDER_TYPE.BID) {
        result = nxt.price - curr.price;
      } else {
        result = curr.price - nxt.price;
      }
      return result;
    });
    return sortedOrder?.map((item: any, index: number) => (
      <div
        key={item.amount + index}
        className="text-gray-300 text-sm flex justify-between mb-[0.08rem]"
      >
        {orderType === ORDER_TYPE.BID ? (
          <>
            <span className="text-green-400 w-1/3">
              {formatNumber(item.price, 2)}
            </span>
            <span className="w-1/3 text-right">
              {formatNumber(item.amount, 2)}
            </span>
            <span className="text-green-500 w-1/3 text-right">
              {formatNumber(item.total, 2)}
            </span>
          </>
        ) : (
          <>
            <span className="text-red-800 w-1/3">
              {formatNumber(item.total, 2)}
            </span>
            <span className="w-1/3 text-right">
              {formatNumber(item.amount, 2)}
            </span>
            <span className="text-red-800 w-1/3 text-right">
              {formatNumber(item.price, 2)}
            </span>
          </>
        )}
      </div>
    ));
  };

  return (
    <>
      <div
        className="table-fixed w-full md:w-[49.5%] text-gray-400
       bg-slate-800 px-3 py-4"
      >
        {orderType === ORDER_TYPE.BID ? (
          <div className="flex justify-between">
            <span className="relative text-left w-1/3">
              Price{`(${quoteName})`}
            </span>
            <span className="w-1/3 text-right">Amount{`(${baseName})`}</span>
            <span className="w-1/3 text-right">Total{`(${baseName})`}</span>
          </div>
        ) : (
          <div className="flex justify-between">
            <span className="w-1/3">Total{`(${baseName})`}</span>
            <span className="w-1/3 text-right">Amount{`(${baseName})`}</span>
            <span className="relative text-right w-1/3">
              Price{`(${quoteName})`}
            </span>
          </div>
        )}
        {renderOrders()}
      </div>
    </>
  );
});
