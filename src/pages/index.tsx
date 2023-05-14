import { AssetCard } from '@/components/AssetCard';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import tokens from '../pages/api/tokens.json';

const Home = () => {
  const [assets, setAssets] = useState<any[]>([] as any[]);

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
    <main className="px-20 py-12">
      <div className="flex items-center mb-4">
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
      <div className="grid md:flex  flex-wrap">{renderAssetCards()}</div>
    </main>
  );
};

export default Home;
