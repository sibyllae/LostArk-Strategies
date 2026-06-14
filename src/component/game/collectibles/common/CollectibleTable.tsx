import { Table, Tag, Tooltip } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CollectibleReward, CollectibleItem } from '../service';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Column } = Table;

interface RewardTableProps {
  rewards: CollectibleReward[];
  title: string;
}

export const RewardTable: React.FC<RewardTableProps> = ({ rewards, title }) => {
  const { loading } = useSelector((store: RootState) => store.loading);
  const data = rewards.map((r, i) => ({ ...r, key: i }));

  return (
    <div className='mb-6'>
      <h3 className='text-base font-semibold text-zinc-300 mb-3 flex items-center gap-2'>
        <span className='w-1.5 h-1.5 rounded-full bg-amber-400'></span>
        {title}
      </h3>
      <Table
        dataSource={data}
        pagination={false}
        loading={loading}
        size='small'
        className='w-full'
      >
        <Column
          title='數量'
          dataIndex='count'
          key='count'
          width={80}
          render={(val: number) => (
            <Tag color='blue' className='font-mono font-bold'>
              {val}
            </Tag>
          )}
        />
        <Column title='獎勵' dataIndex='reward' key='reward' />
        <Column
          title='備註'
          dataIndex='note'
          key='note'
          render={(val: string) =>
            val ? (
              <Tooltip title={val}>
                <span className='text-zinc-400 cursor-help flex items-center gap-1'>
                  <InfoCircleOutlined /> {val}
                </span>
              </Tooltip>
            ) : (
              ''
            )
          }
        />
      </Table>
    </div>
  );
};

interface ItemTableProps {
  items: CollectibleItem[];
  title: string;
  idLabel?: string;
}

export const ItemTable: React.FC<ItemTableProps> = ({
  items,
  title,
  idLabel = '#',
}) => {
  const { loading } = useSelector((store: RootState) => store.loading);
  const data = items.map((item, i) => ({ ...item, key: i }));

  return (
    <div className='mb-6'>
      <h3 className='text-base font-semibold text-zinc-300 mb-3 flex items-center gap-2'>
        <span className='w-1.5 h-1.5 rounded-full bg-emerald-400'></span>
        {title}
      </h3>
      <Table
        dataSource={data}
        pagination={false}
        loading={loading}
        size='small'
        className='w-full'
      >
        <Column
          title={idLabel}
          key='id'
          width={60}
          render={(_: any, record: any) => (
            <Tag color='cyan' className='font-mono'>
              {record.id ?? record.island ?? '-'}
            </Tag>
          )}
        />
        <Column title='來源' dataIndex='source' key='source' />
        <Column
          title='備註'
          dataIndex='note'
          key='note'
          render={(val: string) =>
            val ? (
              <span className='text-amber-400/80 text-xs'>⚠ {val}</span>
            ) : (
              ''
            )
          }
        />
      </Table>
    </div>
  );
};

interface IslandTokenTableProps {
  items: { island: string; source: string; note: string; key?: React.Key }[];
  title: string;
}

export const IslandTokenTable: React.FC<IslandTokenTableProps> = ({
  items,
  title,
}) => {
  const { loading } = useSelector((store: RootState) => store.loading);
  const data = items.map((item, i) => ({ ...item, key: i }));

  return (
    <div className='mb-6'>
      <h3 className='text-base font-semibold text-zinc-300 mb-3 flex items-center gap-2'>
        <span className='w-1.5 h-1.5 rounded-full bg-emerald-400'></span>
        {title}
      </h3>
      <Table
        dataSource={data}
        pagination={false}
        loading={loading}
        size='small'
        className='w-full'
      >
        <Column title='島嶼' dataIndex='island' key='island' width={140} />
        <Column title='取得方式' dataIndex='source' key='source' />
        <Column
          title='備註'
          dataIndex='note'
          key='note'
          render={(val: string) =>
            val ? (
              <span className='text-amber-400/80 text-xs'>⚠ {val}</span>
            ) : (
              ''
            )
          }
        />
      </Table>
    </div>
  );
};
