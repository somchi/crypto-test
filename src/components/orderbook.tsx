import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { OrderBookTable } from './orderBookTable';
import { memo, useEffect } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import {
  AskRequestId,
  BidRequestId,
  ORDER_TYPE,
  WebSocketUrl,
} from '@/utils/constants';
import { formatAsksData, formatBidsData } from '@/utils/helper';
import { setAsks, setBids } from '@/store/reducers/app.reducers';

type Props = {
  baseToken: any;
  quoteToken: any;
};

export const OrderBook = memo(({ baseToken, quoteToken }: Props) => {
  const selector = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const { sendJsonMessage, getWebSocket } = useWebSocket(WebSocketUrl, {
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
  });

  // useEffect(() => {
  //   const message = {
  //     type: 'subscribe',
  //     channel: 'orders',
  //     requestId: BidRequestId,
  //     payload: {
  //       takerToken: quoteToken.address,
  //       makerToken: baseToken.address,
  //     },
  //   };
  //   sendJsonMessage(message);
  // }, [sendJsonMessage, getWebSocket]);

  // useEffect(() => {
  //   const message = {
  //     type: 'subscribe',
  //     channel: 'orders',
  //     requestId: AskRequestId,
  //     payload: {
  //       takerToken: quoteToken.address,
  //       makerToken: baseToken.address,
  //     },
  //   };
  //   sendJsonMessage(message);
  // }, [sendJsonMessage, getWebSocket]);

  useEffect(() => {
    const message = {
      type: 'subscribe',
      channel: 'orders',
      requestId: AskRequestId,
    };
    sendJsonMessage(message);
  }, [sendJsonMessage, getWebSocket]);

  const processMessages = (event: any) => {
    const response = JSON.parse(event.data);
    const requestId = response.requestId;
    const payload = response.payload;
    // const records = { records: [...payload] };

    const data = [...payload];
    const bids = data.filter(
      (item) =>
        item.order.makerToken === quoteToken.address &&
        item.order.takerToken === baseToken.address
    );
    const asks = data.filter(
      (item) =>
        item.order.makerToken === baseToken.address &&
        item.order.takerToken === quoteToken.address
    );

    if (bids.length !== 0) {
      const bidsRecords = { records: [...bids] };
      const formatedBids = formatBidsData(
        bidsRecords,
        quoteToken.decimals,
        baseToken.decimals
      );
      dispatch(setBids(formatedBids));
    }

    if (asks.length !== 0) {
      const asksRecords = { records: [...asks] };
      const formatedAsks = formatAsksData(
        asksRecords,
        quoteToken.decimals,
        baseToken.decimals
      );
      dispatch(setAsks(formatedAsks));
    }

    // if (requestId === BidRequestId) {
    //   const bids = formatBidsData(
    //     records,
    //     quoteToken.decimals,
    //     baseToken.decimals
    //   );
    //   dispatch(setBids(bids));
    // } else {
    //   const asks = formatAsksData(
    //     records,
    //     quoteToken.decimals,
    //     baseToken.decimals
    //   );
    //   dispatch(setAsks(asks));
    // }
  };

  return (
    <div className="flex justify-between flex-wrap max-h-[80vh] overflow-y-auto">
      <OrderBookTable
        data={selector.bids}
        orderType={ORDER_TYPE.BID}
        baseName={baseToken.symbol}
        quoteName={quoteToken.symbol}
      />
      <OrderBookTable
        data={selector.asks}
        orderType={ORDER_TYPE.ASK}
        baseName={baseToken.symbol}
        quoteName={quoteToken.symbol}
      />
    </div>
  );
});
