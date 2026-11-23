/** 依獎勵內容給予克制的語意色調（貼近 Lost Ark 道具稀有度語意） */
export const rewardTone = (reward: string): string => {
  if (/巨人心臟|血爪海圖/.test(reward)) return 'bg-gold-500/15 text-gold-300 ring-gold-500/35';
  if (/技能點數|悟性點數/.test(reward)) return 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30';
  if (reward.includes('卡片')) return 'bg-sky-500/10 text-sky-300 ring-sky-500/25';
  if (/表情|動作|樂譜|曲譜|之歌/.test(reward)) return 'bg-purple-500/10 text-purple-300 ring-purple-500/25';
  if (/金$|\d+(\.\d+)?k?金/.test(reward)) return 'bg-amber-500/10 text-amber-200 ring-amber-500/25';
  return 'bg-obsidian-850 text-stone-300 ring-obsidian-700';
};
