import { Table, Tag, Card, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import useService, { RaidChestsData, RaidInfo, RaidGate } from './service';
import {
  GoldOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Column } = Table;

const RaidCard = ({ raid }: { raid: RaidInfo }) => {
  const gateData = raid.gates.map((g, i) => ({ ...g, key: i }));
  const profitRate = ((raid.netGold / raid.totalGold) * 100).toFixed(0);

  return (
    <Card
      className='mb-6 !bg-zinc-800/60 !border-zinc-700/50'
      title={
        <div className='flex items-center justify-between flex-wrap gap-2'>
          <div className='flex items-center gap-3'>
            <TrophyOutlined className='text-amber-400 text-lg' />
            <span className='text-lg font-bold text-zinc-100'>{raid.name}</span>
            <span className='text-zinc-500 text-sm'>{raid.nameEn}</span>
          </div>
          <Tag color='orange' className='!text-sm'>
            裝分 {raid.ilvl}
          </Tag>
        </div>
      }
    >
      {/* Stats */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4'>
        <div className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30'>
          <p className='text-zinc-500 text-xs mb-1'>總金幣獎勵</p>
          <p className='text-amber-400 text-xl font-bold flex items-center gap-1'>
            <GoldOutlined /> {raid.totalGold.toLocaleString()}
          </p>
        </div>
        <div className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30'>
          <p className='text-zinc-500 text-xs mb-1'>總開箱成本</p>
          <p className='text-red-400 text-xl font-bold'>
            -{raid.totalChestCost.toLocaleString()}
          </p>
        </div>
        <div className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30'>
          <p className='text-zinc-500 text-xs mb-1'>淨收益</p>
          <p className='text-emerald-400 text-xl font-bold'>
            {raid.netGold.toLocaleString()}
          </p>
        </div>
        <div className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30'>
          <p className='text-zinc-500 text-xs mb-1'>淨收益率</p>
          <p className='text-blue-400 text-xl font-bold'>{profitRate}%</p>
        </div>
      </div>

      {/* Gate Table */}
      <Table
        dataSource={gateData}
        pagination={false}
        size='small'
        className='hidden xl:block'
      >
        <Column title='關卡' dataIndex='gate' key='gate' width={100} />
        <Column
          title='金幣獎勵'
          dataIndex='goldReward'
          key='goldReward'
          width={120}
          render={(val: number) => (
            <span className='text-amber-400 font-bold'>
              {val.toLocaleString()} G
            </span>
          )}
        />
        <Column
          title='開箱成本'
          dataIndex='chestCost'
          key='chestCost'
          width={120}
          render={(val: number) => (
            <span className='text-red-400'>-{val.toLocaleString()} G</span>
          )}
        />
        <Column
          title='寶箱內容'
          dataIndex='chestContents'
          key='chestContents'
        />
      </Table>

      {/* Mobile Gate Cards */}
      <div className='xl:hidden space-y-2'>
        {raid.gates.map((g: RaidGate, i: number) => (
          <div
            key={i}
            className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30'
          >
            <div className='flex justify-between items-center mb-2'>
              <Tag color='purple'>{g.gate}</Tag>
              <div className='flex gap-3'>
                <span className='text-amber-400 font-bold text-sm'>
                  +{g.goldReward}G
                </span>
                <span className='text-red-400 text-sm'>-{g.chestCost}G</span>
              </div>
            </div>
            <p className='text-zinc-400 text-xs'>{g.chestContents}</p>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className='mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg'>
        <p className='text-blue-400 text-sm flex items-center gap-2'>
          <InfoCircleOutlined />
          {raid.recommendation}
        </p>
      </div>
    </Card>
  );
};

const RaidChests = () => {
  const { getRaidChests } = useService();
  const [data, setData] = useState<RaidChestsData | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const res = await getRaidChests();
    setData(res);
  };

  return (
    <div className='w-full'>
      <div className='flex flex-wrap'>
        <div className='flex-none w-1/2'>
          <div className='font-bold m-4 text-xl border-l-4 border-amber-500'>
            <span className='px-2'>副本開箱分析</span>
          </div>
        </div>
      </div>
      <div className='px-4'>
        {data?.raids.map((raid, i) => (
          <RaidCard key={i} raid={raid} />
        ))}
        {data?.notes && (
          <Alert
            type='info'
            showIcon
            className='!mb-4 !bg-zinc-800/60 !border-zinc-700/50'
            message='注意事項'
            description={
              <ul className='list-disc pl-4 space-y-1 text-zinc-400'>
                {data.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            }
          />
        )}
      </div>
    </div>
  );
};

export default RaidChests;
