import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'lostark_codex_tracker_v1';

export interface TrackerState {
  /** 已取得的收集品鍵值，例如 `giantHearts:1` 或 `islandTokens:夢幻島` */
  collectibles: string[];
  /** 已完成伊格涅亞標誌（100% 冒險之書）的大陸名稱 */
  igneaRegions: string[];
  /** 已滿好感度的 NPC id */
  npcs: string[];
  /** 排入每週 3 本試算的副本識別鍵（最多 3 個） */
  pinnedRaids: string[];
  /** 遠征隊領金角色數（1～6） */
  rosterChars: number;
}

const DEFAULT_STATE: TrackerState = {
  collectibles: [],
  igneaRegions: [],
  npcs: [],
  pinnedRaids: [],
  rosterChars: 1,
};

let cachedRaw: string | null = null;
let cachedState: TrackerState = DEFAULT_STATE;
const listeners = new Set<() => void>();

function readSnapshot(): TrackerState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedState;
    cachedRaw = raw;
    if (!raw) {
      cachedState = DEFAULT_STATE;
      return cachedState;
    }
    const parsed = JSON.parse(raw) as Partial<TrackerState>;
    cachedState = {
      collectibles: Array.isArray(parsed.collectibles) ? parsed.collectibles : [],
      igneaRegions: Array.isArray(parsed.igneaRegions) ? parsed.igneaRegions : [],
      npcs: Array.isArray(parsed.npcs) ? parsed.npcs : [],
      pinnedRaids: Array.isArray(parsed.pinnedRaids) ? parsed.pinnedRaids.slice(0, 3) : [],
      rosterChars:
        typeof parsed.rosterChars === 'number' && parsed.rosterChars >= 1 && parsed.rosterChars <= 6
          ? parsed.rosterChars
          : 1,
    };
    return cachedState;
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(updater: (prev: TrackerState) => TrackerState) {
  const next = updater(readSnapshot());
  const raw = JSON.stringify(next);
  cachedRaw = raw;
  cachedState = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // 忽略無痕模式配額錯誤
  }
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const toggleInList = (list: string[], key: string): string[] =>
  list.includes(key) ? list.filter((item) => item !== key) : [...list, key];

export const getRaidKey = (nameEn: string, difficulty = '普通') => `${nameEn}|${difficulty}`;

export function useLocalTracker() {
  const state = useSyncExternalStore(subscribe, readSnapshot, () => DEFAULT_STATE);

  const toggleCollectible = useCallback((key: string) => {
    writeState((prev) => ({
      ...prev,
      collectibles: toggleInList(prev.collectibles, key),
    }));
  }, []);

  const clearCollectiblePrefix = useCallback((prefix: string) => {
    writeState((prev) => ({
      ...prev,
      collectibles: prev.collectibles.filter((item) => !item.startsWith(`${prefix}:`)),
    }));
  }, []);

  const toggleIgneaRegion = useCallback((region: string) => {
    writeState((prev) => ({
      ...prev,
      igneaRegions: toggleInList(prev.igneaRegions, region),
    }));
  }, []);

  const toggleNpc = useCallback((npcId: string) => {
    writeState((prev) => ({
      ...prev,
      npcs: toggleInList(prev.npcs, npcId),
    }));
  }, []);

  const togglePinnedRaid = useCallback((raidKey: string) => {
    writeState((prev) => {
      if (prev.pinnedRaids.includes(raidKey)) {
        return { ...prev, pinnedRaids: prev.pinnedRaids.filter((k) => k !== raidKey) };
      }
      if (prev.pinnedRaids.length >= 3) {
        return { ...prev, pinnedRaids: [...prev.pinnedRaids.slice(1), raidKey] };
      }
      return { ...prev, pinnedRaids: [...prev.pinnedRaids, raidKey] };
    });
  }, []);

  const setPinnedRaids = useCallback((raidKeys: string[]) => {
    writeState((prev) => ({
      ...prev,
      pinnedRaids: raidKeys.slice(0, 3),
    }));
  }, []);

  const setRosterChars = useCallback((count: number) => {
    const clamped = Math.min(6, Math.max(1, Math.round(count)));
    writeState((prev) => ({
      ...prev,
      rosterChars: clamped,
    }));
  }, []);

  return {
    state,
    toggleCollectible,
    clearCollectiblePrefix,
    toggleIgneaRegion,
    toggleNpc,
    togglePinnedRaid,
    setPinnedRaids,
    setRosterChars,
  };
}
