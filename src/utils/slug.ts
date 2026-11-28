/** 產生穩定的 DOM id 供錨點快速跳轉與深層連結複製使用 */
export function toAnchorId(prefix: string, raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${prefix}-${cleaned || 'item'}`;
}

/**
 * 剪貼簿複製（附帶隱藏 textarea fallback，相容非 HTTPS 或受限 WebView 環境）
 * 嚴格對齊 obsidian-lookup-uiux SKILL.md Section 5 Clipboard Fallback
 */
export async function copyTextWithFallback(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy textarea selection
    }
  }
  if (typeof document === 'undefined') return false;
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/**
 * 平滑捲動至目標錨點卡片，並觸發短暫 --border-active 高亮脈衝
 * 自動尊重 prefers-reduced-motion: reduce (SKILL.md Section 4E & Section 5)
 */
export function scrollToAndPulseAnchor(id: string): boolean {
  if (typeof document === 'undefined' || !id) return false;
  const el = document.getElementById(id);
  if (!el) return false;

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  el.scrollIntoView({
    behavior: prefersReduced ? 'auto' : 'smooth',
    block: 'start',
  });

  if (!prefersReduced) {
    el.classList.remove('anchor-pulse');
    // Reflow to restart animation if clicked repeatedly
    void el.offsetWidth;
    el.classList.add('anchor-pulse');
    window.setTimeout(() => {
      el.classList.remove('anchor-pulse');
    }, 1150);
  }
  return true;
}

/**
 * 失落的方舟台服／國際服／韓服／陸服常用舊譯名與俗稱對照表（供 Q / / 全站模糊搜尋比對）
 */
const ALIAS_GROUPS: ReadonlyArray<readonly string[]> = [
  ['伐爾坦', 'valtan', '牛頭', '魔獸軍團長', '巴爾坦'],
  ['維亞奇絲', 'vykas', '魅魔', '慾望軍團長', '維婭奇絲'],
  ['庫克賽頓', 'kakul', '小丑', '狂氣軍團長', '馬戲團', '庫克'],
  ['布雷夏沙', 'brelshaza', '夢幻', '阿布', '冰阿布', '第2幕', '夢幻軍團長'],
  ['卡楊格爾', 'kayangel', '天界', '陽光', '拉우리엘', '勞里埃爾'],
  ['阿坎', 'akkan', '瘟疫', '伊利亞坎', '瘟疫軍團長'],
  ['象牙塔', 'ivory', '煉金', '鍊金', '艾利西爾', 'elixir', '40覺', '混亂象牙塔'],
  ['卡蒙', 'thaemine', '卡門', '黑暗軍團長', '超越', '暗黑火'],
  ['艾奇德娜', 'echidna', '蛇女', '慾望序幕', '進階精煉', '高級精煉'],
  ['貝希莫斯', 'behemoth', '16人', '武器超越', '暴風龍', '大龍'],
  ['艾吉爾', 'aegir', '第1幕', '巨人', '業火', '地獄火焰'],
  ['莫敦', 'mordum', '第3幕', '雷神', '莫爾頓'],
  ['阿爾莫切', 'armoche', '第4幕', '星圖核心', '毀滅要塞'],
  ['卡札羅斯', 'kazeros', '終幕', '深淵之主', '卡제로스'],
  ['賽爾卡', 'serca', 'serka', '痛苦魔女', '暗影襲擊戰'],
  ['貝爾加丁', 'belgardin', '死亡仲裁者', '護腕', '臂甲', 'bracers', 'vambraces'],
  ['地平線大聖堂', 'horizon cathedral', '卡達魯姆', 'cadarum', '綁金', '大聖堂'],
  ['光之救贖', 'los', '光卡', '光救', '30覺'],
  ['殘存的風之絕壁', 'lwc', '暴擊套', '風絕壁', '南風'],
  ['惡魔傷', 'demon damage', '圖鑑加成', '種族增傷'],
  ['韋毅', 'wei', '愛尼茨商人', '維伊'],
  ['巴亨圖爾', 'balthorr', '約恩商人', '矮人王', '巴亨'],
  ['瓦爾格里斯', 'vairgrys', '愛迦希亞商人'],
  ['瓦爾坎', 'varkan', '伏爾戴克商人'],
  ['幻獸師', 'wildsoul', '熊狐', '尤茲'],
  ['女聖騎士', 'valkyrie', '瓦爾基里', '女聖騎'],
  ['龍騎士', 'dragonknight', '龍騎'],
  ['拳剎', 'breaker', '修羅', '拳王', '男格鬥'],
  ['噬魂者', 'souleater', '鐮刀', '死神', '滿月', '殘月'],
  ['處決者', 'slayer', '女狂', '女狂戰', '處刑者', '捕食者'],
  ['氣象術士', 'aeromancer', '雨傘', '疾風', '細雨'],
  ['墨靈', 'artist', '畫家', '小畫家'],
  ['刀鋒', 'deathblade', 'blade', '殘留能量', '刀爆'],
  ['女巫', 'sorceress', '點火', '環流'],
  ['史可拉奇亞', 'skolakia', '蠍子'],
  ['德雷克塔拉斯', 'drextalas', '火龍'],
  ['克爾卡洛斯', 'krathios', '雷獸'],
  ['阿爾戈斯', 'argeos', '阿蓋奧羅斯'],
  ['怨恨', 'grudge'],
  ['腎上腺素', 'adrenaline', '腎腺'],
  ['銳利鈍器', 'keen blunt', 'kbw', '鈍器'],
  ['突擊隊長', 'raid captain', '突襲隊長'],
  ['咒術人偶', 'cursed doll', '人偶'],
  ['奇襲大師', 'ambush master', '背擊'],
  ['決鬥大師', 'master brawler', '頭擊'],
  ['打擊大師', 'hit master', '側擊'],
  ['專業醫生', 'expert', '專醫'],
  ['妙手回春', 'drops of ether', '以太生成'],
  ['劫火', 'doomfire', '烈火寶石', '增傷寶石'],
  ['光輝', 'blazing', '灼熱寶石', '冷卻寶石'],
  ['血爪海圖', 'bloodclaw', 'crimsnail'],
  ['方舟星圖', 'ark grid', '星石', 'astrogem'],
  ['悟性', '領悟', 'enlightenment'],
  ['精準格擋', 'just guard', 'jg', 'g鍵'],
  ['艾斯特', 'sidereal', '聯手技', '神選英雄'],
  ['阿斯特雷伊', 'astray', '海盜船'],
  ['艾斯托克', 'estoque'],
  ['盧米納斯', 'luminas'],
  ['奧萊赫', 'oreha', '阿比多斯', 'abidos', '融合材料'],
];

/** 將搜尋字詞展開為同義詞陣列，只要任一同義詞命中即視為匹配 */
export function expandSearchAliases(query: string): string[] {
  const kw = query.trim().toLowerCase();
  if (!kw) return [];
  const terms = new Set<string>([kw]);
  for (const group of ALIAS_GROUPS) {
    if (group.some((alias) => alias.toLowerCase().includes(kw) || kw.includes(alias.toLowerCase()))) {
      group.forEach((alias) => terms.add(alias.toLowerCase()));
    }
  }
  return Array.from(terms);
}

export function matchesWithAliases(
  query: string,
  ...fields: Array<string | number | null | undefined | ReadonlyArray<string>>
): boolean {
  const kw = query.trim().toLowerCase();
  if (!kw) return true;
  const haystack = fields
    .flat()
    .filter((f): f is string | number => f != null)
    .map((f) => String(f).toLowerCase())
    .join(' ');
  const candidates = expandSearchAliases(kw);
  return candidates.some((term) => haystack.includes(term));
}
