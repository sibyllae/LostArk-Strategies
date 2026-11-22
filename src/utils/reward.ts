/** 依獎勵內容給予不同的視覺色調，讓重要獎勵（巨人心臟、卡片等）更醒目 */
export const rewardTone = (reward: string): string => {
  if (reward.includes('巨人心臟')) return 'bg-amber-500/10 text-amber-200 ring-amber-400/30';
  if (reward.includes('卡片')) return 'bg-sky-500/10 text-sky-200 ring-sky-400/30';
  if (/表情|動作|樂譜|曲譜/.test(reward)) return 'bg-violet-500/10 text-violet-200 ring-violet-400/30';
  if (/金$|\d+(\.\d+)?k?金/.test(reward)) return 'bg-yellow-500/10 text-yellow-100 ring-yellow-400/25';
  return 'bg-white/5 text-zinc-200 ring-white/10';
};
