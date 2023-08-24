import { useState, useEffect, useMemo } from 'react';
import { ORDERBOOK_LEVELS, ORDER_TYPE } from '../utils/constants';
import { memo } from 'react';
import { formatNum } from '../utils/helper';
import { BitOrder } from '../utils/bit-types';
import { useAppSelector } from '../store/hooks';

type Props = {
  data: BitOrder[];
  orderType: number;
  precision: number;
};

export const OrderBookTable = memo(function OrderBookTable({
  data,
  orderType,
  precision,
}: Props) {
  const DepthVisualizerColors = {
    BIDS: '#113534',
    ASKS: '#3d1e28',
  };

  const [deviceWidth, setDeviceWidth] = useState<number>(0);
  const sel = useAppSelector((state) => state.bit);

  useEffect(() => {
    const width = window.innerWidth;
    setDeviceWidth(width);
  }, []);

  const renderOrders = () => {
    const sortData = [...data].sort(
      (currItem: BitOrder, nextItem: BitOrder) => {
        if (orderType === ORDER_TYPE.BID || deviceWidth <= 800) {
          return nextItem.price - currItem.price;
        }
        return currItem.price - nextItem.price;
      }
    );
    return sortData.map((item: any, index: number) => {
      const depth = item.depth;
      const left =
        orderType === ORDER_TYPE.BID || deviceWidth <= 800
          ? `${100 - depth}%`
          : 0;
      return (
        <div
          key={item.amount + index + orderType}
          style={{ position: 'relative' }}
        >
          <div
            style={{
              backgroundColor: `${
                orderType === ORDER_TYPE.BID
                  ? DepthVisualizerColors.BIDS
                  : DepthVisualizerColors.ASKS
              }`,
              position: 'relative',
              top: 21,
              width: `${depth}%`,
              height: '1.2rem',
              marginTop: -24,
              zIndex: 0,
              left: left,
            }}
          ></div>
          {orderType === ORDER_TYPE.BID ? (
            <div className="flex justify-between relative">
              <span className="text-right">{formatNum(item.count)}</span>
              <span className="text-right">{formatNum(item.amount)}</span>
              <span className="text-right">{formatNum(item.total)}</span>
              <span className="text-right">{formatNum(item.price)}</span>
            </div>
          ) : (
            <div className="flex justify-between relative md:ml-2">
              <span className="text-right">{formatNum(item.price)}</span>
              <span className="text-right">{formatNum(item.total)}</span>
              <span className="text-right">{formatNum(item.amount)}</span>
              <span className="text-right">{formatNum(item.count)}</span>
            </div>
          )}
        </div>
      );
    });
  };

  const tableHeader = () => {
    return orderType === ORDER_TYPE.BID ? (
      <div className="flex justify-between">
        <span className="text-right">COUNT</span>
        <span className="text-right">AMOUNT</span>
        <span className="text-right">TOTAL</span>
        <span className="text-right">PRICE</span>
      </div>
    ) : (
      <div className="flex justify-between md:ml-2">
        <span className="text-right">PRICE</span>
        <span className="text-right">TOTAL</span>
        <span className="text-right">AMOUNT</span>
        <span className="text-right">COUNT</span>
      </div>
    );
  };

  return (
    <div className="grid">
      {tableHeader()}
      {renderOrders()}
    </div>
  );
});
