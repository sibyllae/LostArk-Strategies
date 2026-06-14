import { Tag } from 'antd';
import React from 'react';
import { CollectibleReward, CollectibleItem } from '../service';
import { InfoCircleOutlined } from '@ant-design/icons';

interface RewardCardsProps {
  rewards: CollectibleReward[];
  title: string;
}

export const RewardCards: React.FC<RewardCardsProps> = ({ rewards, title }) => {
  return (
    <div className='mb-6 xl:hidden'>
      <h3 className='text-base font-semibold text-zinc-300 mb-3 flex items-center gap-2'>
        <span className='w-1.5 h-1.5 rounded-full bg-amber-400'></span>
        {title}
      </h3>
      <div className='space-y-2'>
        {rewards.map((r, i) => (
          <div
            key={i}
            className='bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50 flex items-center justify-between'
          >
            <div className='flex items-center gap-3'>
              <Tag color='blue' className='font-mono font-bold !m-0'>
                {r.count}
              </Tag>
              <span className='text-zinc-200'>{r.reward}</span>
            </div>
            {r.note && (
              <span className='text-amber-400/80 text-xs ml-2'>
                <InfoCircleOutlined /> {r.note}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface ItemCardsProps {
  items: (CollectibleItem & { island?: string })[];
  title: string;
}

export const ItemCards: React.FC<ItemCardsProps> = ({ items, title }) => {
  return (
    <div className='mb-6 xl:hidden'>
      <h3 className='text-base font-semibold text-zinc-300 mb-3 flex items-center gap-2'>
        <span className='w-1.5 h-1.5 rounded-full bg-emerald-400'></span>
        {title}
      </h3>
      <div className='space-y-2'>
        {items.map((item, i) => (
          <div
            key={i}
            className='bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50'
          >
            <div className='flex items-center gap-2 mb-1'>
              <Tag color='cyan' className='font-mono !m-0'>
                {item.id ?? item.island ?? '-'}
              </Tag>
              <span className='text-zinc-200 text-sm'>{item.source}</span>
            </div>
            {item.note && (
              <p className='text-amber-400/80 text-xs mt-1 ml-1'>
                ⚠ {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
