import { memo, useEffect } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { formatBitData, formatBitDataOne } from 'utils/helper-old';
import { setBitAsks, setBitBids } from 'store/reducers/bit.reducers';
import { ORDER_TYPE } from 'utils/constants';
import { OrderBookTable } from './orderBookTable1';

type Props = {
  baseToken: any;
  quoteToken: any;
};

export const OrderBook = memo(function OrderBook({
  baseToken,
  quoteToken,
}: Props) {
  const bitSelector = useAppSelector((state) => state.bit);
  const dispatch = useAppDispatch();
  const { sendJsonMessage, getWebSocket } = useWebSocket(
    'wss://api-pub.bitfinex.com/ws/2',
    {
      shouldReconnect: (closeEvent) => true,
      onMessage: (event: WebSocketEventMap['message']) =>
        processMessages(event),
    }
  );

  // useEffect(() => {
  //   const message = {
  //     type: 'subscribe',
  //     channel: 'orders',
  //     requestId: RequestId,
  //   };
  //   sendJsonMessage(message);
  // }, [sendJsonMessage, getWebSocket]);

  useEffect(() => {
    const message = {
      event: 'subscribe',
      channel: 'book',
      symbol: 'tBTCUSD',
      prec: 'P0',
      freq: 'F0',
      len: '25',
      subId: 123,
    };
    sendJsonMessage(message);
  }, [sendJsonMessage, getWebSocket]);

  const processMessages = (event: any) => {
    const response = JSON.parse(event.data);
    const payload = response[1];
    let formatData: any = {};

    if (!Array.isArray(payload)) return;
    if (Array.isArray(payload[0])) {
      formatData = formatBitData(payload);
    } else {
      formatData = formatBitDataOne(payload);
    }

    if (formatData.bids.length !== 0) {
      dispatch(setBitBids(formatData.bids));
    }

    if (formatData.asks.length !== 0) {
      dispatch(setBitAsks(formatData.asks));
    }
    // console.log(payload);
    // const data = [...payload];
    // const bids = data.filter(
    //   (item) =>
    //     item.order.makerToken === quoteToken.address &&
    //     item.order.takerToken === baseToken.address
    // );
    // const asks = data.filter(
    //   (item) =>
    //     item.order.makerToken === baseToken.address &&
    //     item.order.takerToken === quoteToken.address
    // );

    // if (bids.length !== 0) {
    //   const bidsRecords = { records: [...bids] };
    //   const formatedBids = formatBidsData(
    //     bidsRecords,
    //     quoteToken.decimals,
    //     baseToken.decimals
    //   );
    //   dispatch(setBids(formatedBids));
    // }

    // if (asks.length !== 0) {
    //   const asksRecords = { records: [...asks] };
    //   const formatedAsks = formatAsksData(
    //     asksRecords,
    //     quoteToken.decimals,
    //     baseToken.decimals
    //   );
    //   dispatch(setAsks(formatedAsks));
    // }
  };

  return (
    <div className="flex justify-between flex-wrap max-h-[80vh] overflow-y-auto">
      <OrderBookTable
        data={bitSelector.bids}
        orderType={ORDER_TYPE.BID}
        baseName={baseToken.symbol}
        quoteName={quoteToken.symbol}
      />
      <OrderBookTable
        data={bitSelector.asks}
        orderType={ORDER_TYPE.ASK}
        baseName={baseToken.symbol}
        quoteName={quoteToken.symbol}
      />
    </div>
  );
});
