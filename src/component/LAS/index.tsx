import { useNavigate } from 'react-router-dom';

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  path: string;
  gradient: string;
  borderColor: string;
}

const features: FeatureCard[] = [
  {
    title: '好友度',
    description: 'NPC 好感度獎勵查詢，快速了解各 NPC 的好感度回報',
    icon: '💕',
    path: '/LostArk-Strategies/game/favorability',
    gradient: 'from-rose-500/20 to-pink-500/10',
    borderColor: 'border-rose-500/30 hover:border-rose-500/60',
  },
  {
    title: '冒險之書',
    description: '各地區冒險之書完成度對應的獎勵一覽',
    icon: '📖',
    path: '/LostArk-Strategies/game/adventureBook',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30 hover:border-blue-500/60',
  },
  {
    title: '收集品追蹤',
    description: '巨人心臟、島之心、藝術品等 7 種收集品完整攻略',
    icon: '🏝️',
    path: '/LostArk-Strategies/game/collectibles',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
  },
  {
    title: '副本開箱分析',
    description: '軍團長副本金幣獎勵與開箱價值計算',
    icon: '💰',
    path: '/LostArk-Strategies/game/raidChests',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-amber-500/30 hover:border-amber-500/60',
  },
  {
    title: '雜項攻略',
    description: '樂譜、符文、卡片組、技能點、每日任務等綜合參考',
    icon: '📋',
    path: '/LostArk-Strategies/game/miscGuide',
    gradient: 'from-purple-500/20 to-violet-500/10',
    borderColor: 'border-purple-500/30 hover:border-purple-500/60',
  },
];

const LostArkStrategies = () => {
  const navigate = useNavigate();

  return (
    <div className='w-full max-w-5xl mx-auto px-4 py-6'>
      {/* Hero Section */}
      <div className='text-center mb-10'>
        <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 shadow-2xl shadow-brand-500/30 mb-6'>
          <span className='text-3xl font-black text-white'>LAS</span>
        </div>
        <h2 className='text-3xl xl:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 mb-3'>
          LostArk Strategies
        </h2>
        <p className='text-zinc-500 text-lg mb-2'>失落的方舟攻略網</p>
        <p className='text-zinc-600 text-sm max-w-md mx-auto'>
          整合遊戲資訊，提供收集品追蹤、副本開箱分析與各類攻略參考
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10'>
        {features.map((feature) => (
          <button
            key={feature.path}
            onClick={() => navigate(feature.path)}
            className={`text-left p-5 rounded-xl border bg-gradient-to-br ${feature.gradient} ${feature.borderColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer group`}
          >
            <div className='text-3xl mb-3 group-hover:scale-110 transition-transform'>
              {feature.icon}
            </div>
            <h3 className='text-lg font-bold text-zinc-100 mb-1.5'>
              {feature.title}
            </h3>
            <p className='text-zinc-400 text-sm leading-relaxed'>
              {feature.description}
            </p>
          </button>
        ))}
      </div>

      {/* Credits */}
      <div className='rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-6'>
        <h3 className='text-base font-bold text-zinc-300 mb-4 flex items-center gap-2'>
          <span className='w-1.5 h-1.5 rounded-full bg-brand-500'></span>
          關於本站
        </h3>
        <div className='space-y-3 text-sm text-zinc-500'>
          <p>
            資料參考來源：
            <a
              href='https://docs.google.com/spreadsheets/d/1NuLGvFK98id3n835YzO6judXi2ovRSBgszau8gxHJjo/'
              target='_blank'
              rel='noreferrer'
              className='text-brand-500 hover:text-brand-400 ml-1'
            >
              LOAlazybro 試算表
            </a>
          </p>
          <p>
            參考資料皆為 KR、NA/EU 服各大網站
          </p>
          <p>
            感謝{' '}
            <a
              href='https://forum.gamer.com.tw/C.php?bsn=27410&snA=2130'
              target='_blank'
              rel='noreferrer'
              className='text-brand-500 hover:text-brand-400'
            >
              ro09923
            </a>{' '}
            提供的資訊
          </p>
          <div className='pt-3 border-t border-zinc-800/50 flex flex-wrap gap-4 text-xs text-zinc-600'>
            <span>📧 Tanyzhong@gmail.com</span>
            <span>💬 Discord: YAYA#6893</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostArkStrategies;
