import React from 'react';
import { OrderBookTable } from './OrderBookTable';
import {
  Channel,
  EventName,
  ORDERBOOK_LEVELS,
  ORDER_TYPE,
  Symbol,
} from '../utils/constants';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { useEffect, useMemo, useState } from 'react';
import { formatBitData, formatBitDataOne, isArrayEmpty } from '../utils/helper';
import {
  clearState,
  setBitAsks,
  setBitBids,
  setLoading,
  setRawAsks,
  setRawBid,
} from '../store/reducers/bit.reducers';
import { WEBSOCKET_URL } from '../../config';

let currentBids: any[] = [];
let currentAsks: any[] = [];

export const Orderbook = () => {
  const { sendJsonMessage, getWebSocket } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) => handleMessage(event),
    onClose: (event: WebSocketEventMap['close']) => handleOpening(event),
    onOpen: (event: WebSocketEventMap['open']) => handleOpening(event),
  });
  const [isDisconnected, setDisconnect] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(false);

  const [precision, setPres] = useState<number>(0);

  const selector = useAppSelector((state) => state.bit);
  const dispatch = useAppDispatch();

  const connect = (precision: number) => {
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
    getWebSocket()?.close();
    const message = {
      event: 'unsubscribe',
      channel: Channel,
      subId: 123,
      symbol: Symbol,
    };
    sendJsonMessage(message);
  };

  const handleOpening = (event: any) => {
    console.log(event, '---');
    if (event.type === 'close') {
      setIsClosed(true);
    } else {
      setIsClosed(false);
    }
  };

  useEffect(() => {
    connect(precision);
    return disconnect();
  }, []);

  const toggleConnection = () => {
    const status = !isDisconnected;
    setDisconnect(status);
    if (!isDisconnected) {
      disconnect();
    } else {
      connect(precision);
    }
  };

  const disableToggle = useMemo(() => {
    console.log(sendJsonMessage);
    if (isArrayEmpty(selector.bids) || isArrayEmpty(selector.asks)) {
      return true;
    }
    return false;
  }, [sendJsonMessage]);

  const handleMessage = (event: any) => {
    const response = JSON.parse(event.data);
    const payload = response[1];
    let formatData: any = {};
    if (!Array.isArray(payload)) return;
    if (Array.isArray(payload[0])) {
      formatData = formatBitData(payload);
    } else {
      formatData = formatBitDataOne(payload);
    }

    if (isArrayEmpty(selector.asks) && isArrayEmpty(selector.bids)) {
      dispatch(setRawBid(formatData.bids));
      dispatch(setRawAsks(formatData.asks));
    } else {
      if (formatData.bids.length > 0) {
        currentBids = [...currentBids, ...formatData.bids];
        dispatch(setBitBids(formatData.bids));
        // if (currentBids.length <= ORDERBOOK_LEVELS) {
        //   dispatch(setBitBids(formatData.bids));
        // } else {
        //   dispatch(setBitBids(formatData.bids));

        //   currentBids = [];
        //   currentBids.length = 0;
        // }
      }

      if (formatData.asks.length > 0) {
        currentAsks = [...currentAsks, ...formatData.asks];
        dispatch(setBitAsks(formatData.asks));
        // if (currentAsks.length <= ORDERBOOK_LEVELS) {
        //   dispatch(setBitAsks(formatData.asks));
        // } else {
        //   dispatch(setBitAsks(formatData.asks));
        //   currentAsks = [];
        //   currentAsks.length = 0;
        // }
      }
    }
  };

  const increacePrec = () => {
    const prec = precision + 1;
    if (precision < 5) {
      disconnect();
      dispatch(clearState());
      setPres(prec);
      connect(prec);
    }
  };
  const decreasePrec = () => {
    const prec = precision - 1;
    if (precision >= 0 && precision < 5) {
      disconnect();
      dispatch(clearState());
      setPres(prec);
      connect(prec);
    }
  };

  const precFormater = useMemo(() => {
    return precision;
  }, [precision]);

  return (
    <div className="text-white w-4/5 ">
      <div className="my-8">
        <span>ORDER BOOK BTC/USD</span>
      </div>
      <div>
        <div className="flex">
          <button
            // disabled={disableToggle}
            className={`rounded-xl ${
              isDisconnected ? 'bg-green' : 'bg-red'
            } py-2 px-6`}
            onClick={toggleConnection}
          >
            {isDisconnected ? 'Connect' : 'Disconnect'}
          </button>
        </div>
        <div className="flex justify-end items-center my-4">
          <div className="flex items-center justify-between pr-6">
            <div className="mr-3">
              <img src="/zoom-in.png" alt="" height={15} width={15} />
            </div>
            <div>
              <img src="/zoom-out.png" alt="" height={15} width={15} />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              disabled={precision === 0 ? true : false}
              onClick={() => {
                decreasePrec();
              }}
              title="descrease precision"
              className={`px-2 text-sm ${
                precision === 0 ? 'text-gray-400' : 'text-white'
              }`}
            >
              .0
            </button>
            <button
              disabled={precision === 4 ? true : false}
              onClick={() => {
                increacePrec();
              }}
              title="increase precision"
              className={`px-2 text-sm ${
                precision === 4 ? 'text-gray-400' : 'text-white'
              }`}
            >
              .00
            </button>
          </div>
        </div>
        {isArrayEmpty(selector.asks) || isArrayEmpty(selector.bids) ? (
          <span className="text-white">Loading....</span>
        ) : (
          <div className="grid md:flex gap-2.5 md:gap-0  md:justify-between">
            <div className="order-1 md:order-none w-full max-h-[400px]">
              <OrderBookTable
                data={selector.bids}
                orderType={ORDER_TYPE.BID}
                precision={precFormater}
              />
            </div>
            <div className="w-full max-h-[400px] mb-24">
              <OrderBookTable
                data={selector.asks}
                orderType={ORDER_TYPE.ASK}
                precision={precFormater}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
