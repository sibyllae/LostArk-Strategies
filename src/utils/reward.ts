/** 依獎勵語意回傳支援 Light & Dark 雙主題的道具色階樣式 */
export const rewardTone = (reward: string): string => {
  if (/巨人心臟|血爪海圖|奧菲斯之星|伊格涅亞/.test(reward)) {
    return 'tone-relic';
  }
  if (/技能點數|悟性點數/.test(reward)) {
    return 'tone-emerald';
  }
  if (/傳說|遺物|古代|梅內利克|梅涅里克/.test(reward)) {
    return 'tone-gold';
  }
  if (reward.includes('卡片') || reward.includes('卡包')) {
    return 'tone-sky';
  }
  if (/表情|動作|樂譜|曲譜|之歌|擺設|石像|坐騎|寵物/.test(reward)) {
    return 'tone-purple';
  }
  if (/金$|\d+(\.\d+)?k?金/.test(reward)) {
    return 'tone-gold';
  }
  if (/藥水/.test(reward)) {
    return 'tone-teal';
  }
  return 'tone-neutral';
};
