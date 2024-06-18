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
      className='hidden xl:block w-full'
      loading={loading}
    >
      <Column
        title='Npc'
        render={(record: FavorabilityIn) => {
          return (
            <div>
              <p>{record.npc}</p>
              <p>位置 : {record.location}</p>
              <p>{!!record.love ? `愛情 : ${record.love}` : ''}</p>
            </div>
          );
        }}
      />
      <Column
        title='關注'
        render={(record: FavorabilityIn) => {
          let arr = record.attention as string[];
          return (
            <>
              {arr.map((e) => (
                <p key={e}>{e}</p>
              ))}
            </>
          );
        }}
      />
      <Column
        title='友好'
        render={(record: FavorabilityIn) => {
          let arr = record.friendly as string[];
          return (
            <>
              {arr.map((e) => (
                <p key={e}>{e}</p>
              ))}
            </>
          );
        }}
      />
      <Column
        title='最大好感度'
        dataIndex='maxAffinity'
        key='maxAffinity'
        width={180}
      />
      <Column title='普通' dataIndex='normal' key='normal' />
      <Column
        title='信賴'
        render={(value, record: FavorabilityIn) => {
          let arr = record.trust as string[];
          return (
            <>
              {arr.map((e) => (
                <p key={e}>{e}</p>
              ))}
            </>
          );
        }}
      />
    </Table>
  );
};

export default FavorabilityPC;
