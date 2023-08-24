import { OrderBookTable } from './OrderBookTable';
import { Channel, EventName, ORDER_TYPE, Symbol } from '../utils/constants';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { useEffect, useMemo, useState } from 'react';
import { formatBitData, formatBitDataOne } from '../utils/helper';
import {
  clearState,
  setBitAsks,
  setBitBids,
  setLoading,
  setRawAsks,
  setRawBid,
} from '../store/reducers/bit.reducers';
import { getInitialOrder } from '../apis/bifinex';
import Image from 'next/image';

export const OrderBook = () => {
  const { sendJsonMessage, getWebSocket } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
  });
  const [isDisconnected, setDisconnect] = useState<boolean>(false);

  const [precision, setPres] = useState<number>(0);

  const bitSelector = useAppSelector((state) => state.bit);
  const dispatch = useAppDispatch();

  const initialData = () => {
    dispatch(setLoading(true));
    getInitialOrder(precision)
      .then((res) => {
        const formatData = formatBitData(res.data);

        dispatch(setRawBid(formatData.bids));
        dispatch(setRawAsks(formatData.asks));
        dispatch(setLoading(false));
        connect();
      })
      .catch(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    initialData();
  }, []);

  const connect = () => {
    const message = {
      event: EventName,
      channel: Channel,
      symbol: Symbol,
      prec: `P${precision}`,
      freq: 'F0',
      len: '25',
      subId: 123,
    };
    sendJsonMessage(message);
  };

  const disconnect = () => {
    console.log('====dfd');
    getWebSocket()?.close();
    const message = {
      event: 'unsubscribe',
      channel: Channel,
      subId: 123,
      symbol: Symbol,
    };
    sendJsonMessage(message);
  };

  useEffect(() => {
    if (isDisconnected) {
      disconnect();
    } else {
      connect();
    }
  }, [isDisconnected, sendJsonMessage, getWebSocket]);

  const toggleConnection = () => {
    setDisconnect((isDisconnected) => !isDisconnected);
  };

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
  };

  const increacePrec = () => {
    const prec = precision + 1;
    if (precision < 5) {
      disconnect();
      dispatch(clearState());
      setPres(prec);
      initialData();
    }
  };

  const decreasePrec = () => {
    const prec = precision - 1;
    if (precision >= 0 && precision < 5) {
      disconnect();
      dispatch(clearState());
      setPres(prec);
      initialData();
    }
  };

  const precFormater = useMemo(() => {
    return precision;
  }, [precision]);
};

// {
//   bitSelector.loading ? (
//     <span>Loading....</span>
//   ) : (
//     <div>
//       <OrderBookTable
//         data={bitSelector.bids}
//         orderType={ORDER_TYPE.BID}
//         precision={precFormater}
//       />
//       <OrderBookTable
//         data={bitSelector.asks}
//         orderType={ORDER_TYPE.ASK}
//         precision={precFormater}
//       />
//     </div>
//   );
// }
