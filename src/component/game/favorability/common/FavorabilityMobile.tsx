import { RootState } from '@/store';
import { Table } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { FavorabilityCompIn, FavorabilityIn } from '../service';
const { Column } = Table;

const FavorabilityPC: React.FC<FavorabilityCompIn> = ({
  favorabilityData,
}: FavorabilityCompIn) => {
  /**
   * store
   */
  const { loading } = useSelector((store: RootState) => store.loading);

  return (
    <Table
      dataSource={favorabilityData}
      pagination={false}
      className='xl:hidden w-full'
      loading={loading}
    >
      <Column
        render={(record: FavorabilityIn) => {
          return (
            <div>
              <p className='text-base font-semibold'>⬩ NPN : {record.npc}</p>
              <p className='text-base font-bold'>⬩ 位置 : {record.location}</p>
              <p className='text-base font-bold'>
                {!!record.love ? `⬩ 愛情 : ${record.love}` : ''}
              </p>
              <p className='text-base font-bold'>
                ⬩ 最大好感度 : {record.maxAffinity}
              </p>
              <p className='text-base font-bold'>⬩ 普通 : {record.normal}</p>
              <p className='text-base font-bold'>⬩ 關注 : {record.attention}</p>
              <p className='text-base font-bold'>⬩ 友好 : {record.friendly}</p>
              <p className='text-base font-bold'>⬩ 信賴 : {record.trust}</p>
            </div>
          );
        }}
      />
    </Table>
  );
};

export default FavorabilityPC;
