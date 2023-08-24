import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import tokens from '../pages/api/tokens.json';
import { AssetCard } from 'components/AssetCard';
import { useRouter } from 'next/router';

const Home = () => {
  const [assets, setAssets] = useState<any[]>([] as any[]);
  const router = useRouter();
  useEffect(() => {
    setAssets(tokens.slice(0, 6));
  }, []);

  const renderAssetCards = () => {
    const firstSix = assets.slice(0, 6);
    return firstSix.map((item: any, index) => (
      <AssetCard key={index} data={item} />
    ));
  };
  return (
    <main className="grid px-4 md:px-20 py-12 items-center">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <span>
            <Image
              alt="activity"
              src="/imgs/activity.png"
              width={16}
              height={16}
            />
          </span>
          <p className="pl-4 text-base font-semibold text-main-text">
            Trending Assets
          </p>
        </div>
        <div className="w-1/3">
          <button
            onClick={() => router.push('/book')}
            className="w-full text-white bg-yellow-500 p-3 rounded-xl font-bold"
          >
            Orderbook
          </button>
        </div>
      </div>
      <div className="grid md:flex  flex-wrap">{renderAssetCards()}</div>
    </main>
  );
};

export default Home;
