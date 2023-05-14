import { useEffect, useRef, useState } from 'react';
import tokens from '../pages/api/tokens.json';

type Props = {
  currAsset: any;
  onClick: (assest: any, from?: number) => void;
  from?: number;
};

export const Dropdown = ({ onClick, currAsset, from }: Props) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const wrapperRef = useRef(null);

  const handleClick = (asset: any) => {
    onClick(asset, from);
    setVisibility((visibility) => !visibility);
  };

  const renderItems = () => {
    return tokens.map((item, index) => (
      <div
        key={index}
        className="flex px-4 py-2 items-center cursor-pointer hover:bg-opacity-green10"
        onClick={() => handleClick(item)}
      >
        <img
          className="w-5 h-5 rounded-full"
          src={item.logoURI}
          alt={item.symbol}
        />
        <span className="text-gray-gray1 ml-2">{item.name}</span>
      </div>
    ));
  };

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      const handleClickOutside = (event: { target: any }) => {
        if (ref.current && !ref.current.contains(event.target)) {
          if (visibility) {
            setVisibility((visibility) => !visibility);
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };

  useOutsideAlerter(wrapperRef);

  return (
    <div className="grid" ref={wrapperRef}>
      <div
        className="flex items-center relative border border-gray-500 w-40 rounded-xl bg-gray-800 px-5 py-3"
        onClick={() => setVisibility((visibility) => !visibility)}
      >
        <img
          className="w-5 h-5 rounded-full"
          src={currAsset?.logoURI}
          alt={currAsset?.symbol}
        />
        <span className="text-white ml-1">{currAsset.symbol}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pl-1">
          <button
            type="button"
            className="pr-4 focus:outline-none focus:shadow-outline"
          >
            <i className="border border-gray-gray1 inline-block border-r-2 p-[3px] border-t-0 border-l-0 border-b-2 rotate-45"></i>
          </button>
        </span>
      </div>
      {visibility ? (
        <div className="z-10 absolute h-48 overflow-auto bg-white rounded-xl border shadow-md mt-12 py-2">
          {renderItems()}
        </div>
      ) : null}
    </div>
  );
};
