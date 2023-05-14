import { getCurrentAssestPrice, getTokenPrice } from '@/apis';
import { ASSET } from '@/site-settings/site-navigation';
import { useAppDispatch } from '@/store/hooks';
import { setSelectedAsset } from '@/store/reducers/app.reducers';
import { formatCurrency } from '@/utils/helper';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';

type Props = {
  data: any;
};

export const AssetCard = memo(function AssetCard({ data }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [asset, setAsset] = useState<any>({} as any);

  useEffect(() => {
    if (data.address !== '') {
      getTokenPrice(data.id, data.address).then((res) => {
        const key = Object.keys(res)[0];
        const data = res[key];
        setAsset(data);
      });
    } else {
      getCurrentAssestPrice(data.id).then((res) => setAsset(res));
    }
  }, []);

  const handleClick = () => {
    dispatch(setSelectedAsset(data));
    router.push({ pathname: ASSET.href, query: { asset: data.symbol } });
  };

  return (
    <div
      onClick={handleClick}
      className="grid relative justify-items-center mr-12 cursor-pointer"
    >
      <div
        id="head"
        className="bg-main-bg1 relative px-4 py-8 mb-[-54px] rounded-full z-10"
      >
        <div
          id="icon"
          className="grid mb-[-22px] w-24 h-24  p-6 bg-main-gradientStart  justify-center"
        >
          <img
            className="w-full h-full rounded-full"
            src={data.logoURI}
            alt={data.symbol}
          />
        </div>
      </div>
      <div id="assest-card" className="grid rounded-2xl w-[290px]">
        <div className="grid bg-gradient-to-b rounded-2xl from-main-gradientStart to-main-gradientEnd pt-16 p-5">
          <span className="text-main-name text-BASE font-bold text-center mt-2 mb-3">
            {`${data.name} (${data.symbol.toUpperCase()})`}
          </span>
          <div className="grid">
            <div className="flex bg-main-bg1 rounded-2xl w-60 justify-center items-center py-2">
              <span className="text-main-text mr-4 font-semibold text-basexs">
                {formatCurrency(asset?.usd)}
              </span>
            </div>
            <label className="text-main-label text-xs font-semibold text-center my-2">
              Price
            </label>
          </div>
          <div className="grid mt-1">
            <div className="flex bg-main-bg1 rounded-2xl w-60 justify-center items-center py-2">
              <span
                className={
                  `${
                    Math.sign(asset?.usd_24h_change) === -1
                      ? 'text-main-red'
                      : 'text-main-green'
                  }` + ' font-semibold text-xs'
                }
              >
                {formatCurrency(asset?.usd_24h_change)}
              </span>
            </div>
            <label className="text-main-label text-xs font-semibold text-center my-2">
              24h Change
            </label>
          </div>
        </div>
      </div>
    </div>
  );
});
