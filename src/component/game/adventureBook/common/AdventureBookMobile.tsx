import { RootState } from '@/store';
import { Table } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { AdventureBookCompIn, AdventureBookIn } from '../service';
const { Column } = Table;

const AdventureBookMobile: React.FC<AdventureBookCompIn> = ({
  adventureBookData,
}: AdventureBookCompIn) => {
  /**
   * store
   */
  const { loading } = useSelector((store: RootState) => store.loading);

  return (
    <Table
      dataSource={adventureBookData}
      pagination={false}
      className='xl:hidden w-full'
      loading={loading}
    >
      <Column title='' dataIndex='adventureBook' key='adventureBook' />
      <Column
        title='百分比'
        render={(record: AdventureBookIn) => {
          return (
            <div>
              <p className='text-base font-semibold'>
                ⬩ 10% : {record.tenPercent}
              </p>
              <p className='text-base font-semibold'>
                ⬩ 20% : {record.twentyPercent}
              </p>
              <p className='text-base font-semibold'>
                ⬩ 30% : {record.thirtyPercent}
              </p>
              <p className='text-base font-semibold'>
                ⬩ 40% : {record.fortyPercent}
              </p>
              <p className='text-base font-semibold'>
                ⬩ 50% : {record.fiftyPercent}
              </p>
              <p className='text-base font-semibold'>
                ⬩ 60% : {record.sixtyPercent}
              </p>
              <p className='text-base font-semibold'>
                ⬩ 70% : {record.seventyPercent}
              </p>
              <p className='text-base font-semibold'>
                ⬩ 80% : {record.eightyPercent}
              </p>
              <p className='text-base font-semibold'>
                ⬩ 90% : {record.ninetyPercent}
              </p>
            </div>
          );
        }}
      />
    </Table>
  );
};

export default AdventureBookMobile;
