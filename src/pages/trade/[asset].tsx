import { NextPageContext } from 'next';
import { useEffect, useMemo, useState } from 'react';
import assetTokens from '../api/tokens.json';
import { useRouter } from 'next/router';
import { OrderBook } from 'components/orderbook1';
import { Dropdown } from 'components/Dropdown';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { formatBitData, isStringEmpty } from 'utils/helper-old';
import { clearState } from 'store/reducers/app.reducers';
import { PAIRNAMES } from 'utils/constants';
import { getPairOrder } from 'apis/bifinex';
import { setRawAsks, setRawBid } from 'store/reducers/bit.reducers';
import { Loader } from 'components/Loader';

type Props = {
  query: any;
};

const Asset = ({ query }: Props) => {
  const [baseToken, setBaseToken] = useState<any>({} as any);
  const [quoteToken, setQuoteToken] = useState<any>({} as any);
  const selector = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  const token = useMemo(() => {
    const pairName = query.asset;

    if (pairName.includes('_')) {
      const names = pairName.split('_');
      const baseToken = assetTokens.filter(
        (item) => item.symbol === names[0]
      )[0];
      const quoteToken = assetTokens.filter(
        (item) => item.symbol === names[1]
      )[0];
      return { base: baseToken, quote: quoteToken };
    } else {
      const baseToken = assetTokens.filter(
        (item) => item.symbol === pairName
      )[0];
      return { base: baseToken, quote: '' };
    }
  }, []);

  const getPair = useMemo(() => {
    if (!quoteToken) {
      return { base: baseToken.symbol, quote: '' };
    } else {
      return { base: baseToken.symbol, quote: quoteToken.symbol };
    }
  }, [baseToken, quoteToken]);

  useEffect(() => {
    setQuoteToken(token.quote);
    setBaseToken(token.base);
  }, []);

  const assetPairName = (baseSymbol: string, quoteSymbol: string) => {
    const baseName = isStringEmpty(baseSymbol) ? '' : baseSymbol;
    const quoteName = isStringEmpty(quoteSymbol) ? '' : quoteSymbol;
    const pairName = quoteName !== '' ? `${baseName}_${quoteName}` : baseName;
    return pairName.toUpperCase();
  };

  const resetToken = (token: any, from?: number) => {
    let pairName = '';
    if (from === PAIRNAMES.QUOTE) {
      pairName = assetPairName(baseToken.symbol, token.symbol);
      setQuoteToken(token);
    } else {
      pairName = assetPairName(token.symbol, quoteToken.symbol);
      setBaseToken(token);
    }

    router.replace(
      {
        pathname: router.pathname,
        query: { asset: pairName },
      },
      '',
      { shallow: true }
    );
  };

  const handleTrade = () => {
    if (!baseToken || !quoteToken) return;
    setLoadingOrders(true);
    dispatch(clearState());
    const pair = `${getPair.base}${getPair.quote}`;
    getPairOrder(pair)
      .then((res) => {
        const formatData = formatBitData(res.data);
        dispatch(setRawBid(formatData.bids));
        dispatch(setRawAsks(formatData.asks));
        setLoadingOrders(false);
      })
      .catch((err) => {
        setLoadingOrders(false);
      });
  };

  return (
    <main className="px-4 md:px-20 py-12 grid">
      <div className="text-white">
        <p className="font-semibold text-3xl">
          {`${getPair.base}${getPair.quote}`}
        </p>
      </div>
      <div className="grid my-8">
        <div className="flex w-full justify-between  md:w-3/4 flex-wrap">
          <div className="pb-4 flex items-center">
            <label className="text-white mr-2">You pay </label>
            <Dropdown
              from={PAIRNAMES.QUOTE}
              quote={quoteToken}
              base={baseToken}
              onClick={resetToken}
            />
          </div>
          <div className="pb-4 flex items-center">
            <label className="text-white mr-2">You receive </label>
            <Dropdown
              from={PAIRNAMES.BASE}
              base={baseToken}
              quote={quoteToken}
              onClick={resetToken}
            />
          </div>
          <div className="w-1/3">
            <button
              onClick={handleTrade}
              className="w-full text-white bg-yellow-500 p-3 rounded-xl font-bold"
            >
              Trade
            </button>
          </div>
        </div>
      </div>
      {loadingOrders ? (
        <div className="grid mt-2 md:mt-20">
          <Loader />
        </div>
      ) : (
        <div className="grid">
          <OrderBook baseToken={baseToken} quoteToken={quoteToken} />
        </div>
      )}
    </main>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const query = context.query;
  return { props: { query } };
}

export default Asset;
