import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { AdventureBookCompIn } from '../service';
import { Card, Tag } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const AdventureBookPC: React.FC<AdventureBookCompIn> = ({
  adventureBookData,
}: AdventureBookCompIn) => {
  const { loading } = useSelector((store: RootState) => store.loading);

  if (loading) return null;

  return (
    <div className='hidden xl:grid grid-cols-2 gap-4 w-full'>
      {adventureBookData.map((item, idx) => (
        <Card
          key={idx}
          className='!bg-zinc-800/60 !border-zinc-700/50 hover:!border-blue-500/50 transition-colors'
          title={
            <div className='flex items-center gap-2'>
              <EnvironmentOutlined className='text-blue-400 text-lg' />
              <span className='text-lg font-bold text-zinc-100'>{item.adventureBook}</span>
            </div>
          }
        >
          <div className='grid grid-cols-2 gap-3'>
            {[
              { percent: '10%', val: item.tenPercent },
              { percent: '20%', val: item.twentyPercent },
              { percent: '30%', val: item.thirtyPercent },
              { percent: '40%', val: item.fortyPercent },
              { percent: '50%', val: item.fiftyPercent },
              { percent: '60%', val: item.sixtyPercent },
              { percent: '70%', val: item.seventyPercent },
              { percent: '80%', val: item.eightyPercent },
              { percent: '90%', val: item.ninetyPercent },
            ].map((p) => (
              p.val && (
                <div key={p.percent} className='bg-zinc-900/60 rounded-lg p-2 border border-zinc-700/30 flex items-center gap-2'>
                  <Tag color='blue' className='!m-0 flex-shrink-0 w-12 text-center'>{p.percent}</Tag>
                  <span className='text-zinc-300 text-sm truncate' title={p.val}>{p.val}</span>
                </div>
              )
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AdventureBookPC;
