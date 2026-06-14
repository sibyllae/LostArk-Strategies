import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { FavorabilityCompIn } from '../service';
import { Card, Tag } from 'antd';
import { HeartOutlined, EnvironmentOutlined } from '@ant-design/icons';

const FavorabilityMobile: React.FC<FavorabilityCompIn> = ({
  favorabilityData,
}: FavorabilityCompIn) => {
  const { loading } = useSelector((store: RootState) => store.loading);

  if (loading) return null;

  return (
    <div className='xl:hidden space-y-4 w-full'>
      {favorabilityData.map((record, idx) => (
        <Card
          key={idx}
          className='!bg-zinc-800/60 !border-zinc-700/50'
          title={
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <HeartOutlined className='text-rose-400 text-lg' />
                <span className='text-lg font-bold text-zinc-100'>{record.npc}</span>
              </div>
              <Tag color='red' className='!m-0'>{record.maxAffinity}</Tag>
            </div>
          }
        >
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-zinc-400 text-sm border-b border-zinc-700/50 pb-2'>
              <EnvironmentOutlined />
              <span>{record.location}</span>
            </div>
            
            <div className='space-y-2'>
              <div className='bg-zinc-900/60 rounded-lg p-2 border border-zinc-700/30 flex justify-between'>
                <span className='text-zinc-500 text-sm'>普通</span>
                <span className='text-zinc-300 text-sm text-right'>{record.normal || '-'}</span>
              </div>
              
              <div className='bg-zinc-900/60 rounded-lg p-2 border border-zinc-700/30'>
                <p className='text-zinc-500 text-xs mb-1'>關注</p>
                <div className='text-zinc-300 text-sm'>
                  {Array.isArray(record.attention) ? record.attention.map((a, i) => <div key={i}>{a}</div>) : record.attention || '-'}
                </div>
              </div>

              <div className='bg-zinc-900/60 rounded-lg p-2 border border-zinc-700/30'>
                <p className='text-zinc-500 text-xs mb-1'>友好</p>
                <div className='text-zinc-300 text-sm'>
                  {Array.isArray(record.friendly) ? record.friendly.map((f, i) => <div key={i}>{f}</div>) : record.friendly || '-'}
                </div>
              </div>

              <div className='bg-zinc-900/60 rounded-lg p-2 border border-zinc-700/30 border-l-2 border-l-rose-500'>
                <p className='text-rose-400/80 text-xs mb-1 font-bold'>信賴</p>
                <div className='text-zinc-200 text-sm font-medium'>
                  {Array.isArray(record.trust) ? record.trust.map((t, i) => <div key={i}>{t}</div>) : record.trust || '-'}
                </div>
              </div>
            </div>

            {record.love && (
              <div className='mt-2 bg-rose-500/10 rounded-lg p-2 border border-rose-500/20'>
                <p className='text-rose-400 text-xs mb-1 font-bold'>愛情</p>
                <p className='text-rose-300 text-sm'>{record.love}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FavorabilityMobile;

