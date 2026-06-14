import { Table, Tag, Collapse, Badge } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import useService, {
  MiscGuideData,
  SongData,
  RuneData,
  DailyQuestData,
} from './service';
import {
  CustomerServiceOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Column } = Table;

const MiscGuide = () => {
  const { getMiscGuide } = useService();
  const { loading } = useSelector((store: RootState) => store.loading);
  const [data, setData] = useState<MiscGuideData | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const res = await getMiscGuide();
    setData(res);
  };

  const collapseItems = data
    ? [
        {
          key: 'songs',
          label: (
            <span className='flex items-center gap-2 text-zinc-200'>
              <CustomerServiceOutlined className='text-purple-400' />
              <span className='font-semibold'>曲譜取得方式</span>
              <Badge
                count={data.songs.length}
                style={{ backgroundColor: '#8b5cf6' }}
              />
            </span>
          ),
          children: (
            <>
              <Table
                dataSource={data.songs.map((s, i) => ({ ...s, key: i }))}
                pagination={false}
                loading={loading}
                size='small'
                className='hidden xl:block'
              >
                <Column
                  title='曲譜'
                  dataIndex='name'
                  key='name'
                  width={160}
                  render={(val: string) => (
                    <span className='text-purple-300 font-medium'>{val}</span>
                  )}
                />
                <Column title='取得方式' dataIndex='source' key='source' />
                <Column
                  title='備註'
                  dataIndex='note'
                  key='note'
                  render={(val: string) =>
                    val ? (
                      <span className='text-amber-400/80 text-xs'>
                        ⚠ {val}
                      </span>
                    ) : (
                      ''
                    )
                  }
                />
              </Table>
              <div className='xl:hidden space-y-2'>
                {data.songs.map((s: SongData, i: number) => (
                  <div
                    key={i}
                    className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30'
                  >
                    <p className='text-purple-300 font-medium mb-1'>
                      🎵 {s.name}
                    </p>
                    <p className='text-zinc-400 text-sm'>{s.source}</p>
                    {s.note && (
                      <p className='text-amber-400/80 text-xs mt-1'>
                        ⚠ {s.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ),
        },
        {
          key: 'skillPoints',
          label: (
            <span className='flex items-center gap-2 text-zinc-200'>
              <ThunderboltOutlined className='text-yellow-400' />
              <span className='font-semibold'>技能點數+3 任務</span>
              <Badge
                count={data.skillPoints.length}
                style={{ backgroundColor: '#eab308' }}
              />
            </span>
          ),
          children: (
            <div className='space-y-2'>
              {data.skillPoints.map((sp, i) => (
                <div
                  key={i}
                  className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30 flex items-start gap-3'
                >
                  <Tag color='gold' className='!mt-0.5 flex-shrink-0'>
                    {i + 1}
                  </Tag>
                  <div>
                    <p className='text-zinc-200 text-sm'>{sp.task}</p>
                    {sp.note && (
                      <p className='text-amber-400/80 text-xs mt-1'>
                        ⚠ {sp.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'runes',
          label: (
            <span className='flex items-center gap-2 text-zinc-200'>
              <ExperimentOutlined className='text-cyan-400' />
              <span className='font-semibold'>符文取得 (英雄以上)</span>
              <Badge
                count={data.runes.length}
                style={{ backgroundColor: '#06b6d4' }}
              />
            </span>
          ),
          children: (
            <>
              <Table
                dataSource={data.runes.map((r, i) => ({ ...r, key: i }))}
                pagination={false}
                loading={loading}
                size='small'
                className='hidden xl:block'
              >
                <Column
                  title='符文'
                  dataIndex='rune'
                  key='rune'
                  width={80}
                  render={(val: string) => (
                    <Tag color='cyan' className='font-bold'>
                      {val}
                    </Tag>
                  )}
                />
                <Column
                  title='英雄'
                  dataIndex='heroic'
                  key='heroic'
                  render={(val: string) => (
                    <span className='text-purple-300'>{val || '-'}</span>
                  )}
                />
                <Column
                  title='傳說'
                  dataIndex='legendary'
                  key='legendary'
                  render={(val: string) => (
                    <span className='text-amber-300'>{val || '-'}</span>
                  )}
                />
                <Column
                  title='備註'
                  dataIndex='legendaryNote'
                  key='legendaryNote'
                  render={(val: string) =>
                    val ? (
                      <span className='text-zinc-500 text-xs'>{val}</span>
                    ) : (
                      ''
                    )
                  }
                />
              </Table>
              <div className='xl:hidden space-y-2'>
                {data.runes.map((r: RuneData, i: number) => (
                  <div
                    key={i}
                    className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30'
                  >
                    <Tag color='cyan' className='font-bold mb-2'>
                      {r.rune}
                    </Tag>
                    {r.heroic && (
                      <p className='text-purple-300 text-sm'>
                        <span className='text-zinc-500'>英雄：</span>
                        {r.heroic}
                      </p>
                    )}
                    {r.legendary && (
                      <p className='text-amber-300 text-sm mt-1'>
                        <span className='text-zinc-500'>傳說：</span>
                        {r.legendary}
                      </p>
                    )}
                    {r.legendaryNote && (
                      <p className='text-zinc-500 text-xs mt-1'>
                        {r.legendaryNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ),
        },
        {
          key: 'cardSets',
          label: (
            <span className='flex items-center gap-2 text-zinc-200'>
              <IdcardOutlined className='text-rose-400' />
              <span className='font-semibold'>實用卡組</span>
              <Badge
                count={data.cardSets.length}
                style={{ backgroundColor: '#f43f5e' }}
              />
            </span>
          ),
          children: (
            <div className='space-y-4'>
              {data.cardSets.map((set, si) => (
                <div key={si}>
                  <h4 className='text-base font-bold text-zinc-200 mb-3 flex items-center gap-2'>
                    <span className='w-2 h-2 rounded-full bg-rose-400'></span>
                    {set.setName}
                  </h4>
                  <div className='grid grid-cols-1 xl:grid-cols-2 gap-2'>
                    {set.cards.map((card, ci) => (
                      <div
                        key={ci}
                        className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30 flex items-start gap-3'
                      >
                        <Tag color='magenta' className='flex-shrink-0 !mt-0'>
                          {card.name}
                        </Tag>
                        <span className='text-zinc-400 text-sm'>
                          {card.source}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'dailyLimits',
          label: (
            <span className='flex items-center gap-2 text-zinc-200'>
              <ClockCircleOutlined className='text-orange-400' />
              <span className='font-semibold'>次數限制注意事項</span>
              <Badge
                count={data.dailyLimits.length}
                style={{ backgroundColor: '#f97316' }}
              />
            </span>
          ),
          children: (
            <>
              <Table
                dataSource={data.dailyLimits.map((d, i) => ({
                  ...d,
                  key: i,
                }))}
                pagination={false}
                loading={loading}
                size='small'
                className='hidden xl:block'
              >
                <Column
                  title='內容'
                  dataIndex='content'
                  key='content'
                  width={180}
                  render={(val: string) => (
                    <span className='font-medium text-zinc-200'>{val}</span>
                  )}
                />
                <Column
                  title='限制'
                  dataIndex='limit'
                  key='limit'
                  width={200}
                  render={(val: string) => (
                    <Tag color='orange'>{val}</Tag>
                  )}
                />
                <Column title='備註' dataIndex='note' key='note' />
              </Table>
              <div className='xl:hidden space-y-2'>
                {data.dailyLimits.map((d, i) => (
                  <div
                    key={i}
                    className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30'
                  >
                    <div className='flex items-center justify-between mb-1'>
                      <span className='font-medium text-zinc-200'>
                        {d.content}
                      </span>
                      <Tag color='orange' className='!m-0'>
                        {d.limit}
                      </Tag>
                    </div>
                    <p className='text-zinc-500 text-xs'>{d.note}</p>
                  </div>
                ))}
              </div>
            </>
          ),
        },
        {
          key: 'dailyQuests',
          label: (
            <span className='flex items-center gap-2 text-zinc-200'>
              <CalendarOutlined className='text-green-400' />
              <span className='font-semibold'>每日任務推薦</span>
              <Badge
                count={data.dailyQuests.length}
                style={{ backgroundColor: '#22c55e' }}
              />
            </span>
          ),
          children: (
            <>
              <Table
                dataSource={data.dailyQuests.map((d, i) => ({
                  ...d,
                  key: i,
                }))}
                pagination={false}
                loading={loading}
                size='small'
                className='hidden xl:block'
                scroll={{ x: 900 }}
              >
                <Column
                  title='任務名稱'
                  dataIndex='name'
                  key='name'
                  width={180}
                  render={(val: string) => (
                    <span className='text-green-300 font-medium'>{val}</span>
                  )}
                />
                <Column
                  title='地點'
                  dataIndex='location'
                  key='location'
                  width={180}
                />
                <Column
                  title='每日獎勵'
                  dataIndex='dailyReward'
                  key='dailyReward'
                  width={100}
                />
                <Column
                  title='聲望獎勵'
                  dataIndex='reputationReward'
                  key='reputationReward'
                />
                <Column
                  title='所需天數'
                  dataIndex='requiredDays'
                  key='requiredDays'
                  width={90}
                  render={(val: number) =>
                    val > 0 ? (
                      <Tag color='green'>{val}日</Tag>
                    ) : (
                      <span className='text-zinc-500'>-</span>
                    )
                  }
                />
              </Table>
              <div className='xl:hidden space-y-2'>
                {data.dailyQuests.map((d: DailyQuestData, i: number) => (
                  <div
                    key={i}
                    className='bg-zinc-900/60 rounded-lg p-3 border border-zinc-700/30'
                  >
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-green-300 font-medium text-sm'>
                        {d.name}
                      </span>
                      {d.requiredDays > 0 && (
                        <Tag color='green' className='!m-0'>
                          {d.requiredDays}日
                        </Tag>
                      )}
                    </div>
                    <p className='text-zinc-500 text-xs mb-1'>📍 {d.location}</p>
                    <p className='text-zinc-400 text-xs'>
                      每日：{d.dailyReward}
                    </p>
                    {d.reputationReward && (
                      <p className='text-amber-400/80 text-xs mt-1'>
                        🏆 {d.reputationReward}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ),
        },
      ]
    : [];

  return (
    <div className='w-full'>
      <div className='flex flex-wrap'>
        <div className='flex-none w-1/2'>
          <div className='font-bold m-4 text-xl border-l-4 border-purple-500'>
            <span className='px-2'>雜項攻略</span>
          </div>
        </div>
      </div>
      <div className='px-4'>
        <Collapse
          items={collapseItems}
          defaultActiveKey={['songs']}
          className='!bg-transparent !border-zinc-700/50'
          expandIconPosition='end'
        />
      </div>
    </div>
  );
};

export default MiscGuide;
