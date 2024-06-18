import { RootState } from '@/store';
import { Table } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { AdventureBookCompIn } from '../service';
const { Column } = Table;

const AdventureBookPC: React.FC<AdventureBookCompIn> = ({
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
      className='hidden xl:block w-full'
      loading={loading}
    >
      <Column
        title=''
        dataIndex='adventureBook'
        key='adventureBook'
        width={120}
      />
      <Column title='10%' dataIndex='tenPercent' key='tenPercent' width={1} />
      <Column
        title='20%'
        dataIndex='twentyPercent'
        key='twentyPercent'
        width={1}
      />
      <Column title='30%' dataIndex='thirtyPercent' key='thirtyPercent' />
      <Column title='40%' dataIndex='fortyPercent' key='fortyPercent' />
      <Column title='50%' dataIndex='fiftyPercent' key='fiftyPercent' />
      <Column title='60%' dataIndex='sixtyPercent' key='sixtyPercent' />
      <Column title='70%' dataIndex='seventyPercent' key='seventyPercent' />
      <Column title='80%' dataIndex='eightyPercent' key='eightyPercent' />
      <Column title='90%' dataIndex='ninetyPercent' key='ninetyPercent' />
    </Table>
  );
};

export default AdventureBookPC;
