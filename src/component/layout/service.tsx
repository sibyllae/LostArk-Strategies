import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const useService = () => {
  // menu
  const MenuItems: MenuItem[] = [
    getItem('遊戲資訊', 'game', undefined, [
      getItem('好友度', 'game/favorability'),
      getItem('冒險之書', 'game/adventureBook'),
    ]),
    getItem('收集品', 'collectibles', undefined, [
      getItem('收集品追蹤', 'game/collectibles'),
    ]),
    getItem('攻略工具', 'tools', undefined, [
      getItem('副本開箱分析', 'game/raidChests'),
    ]),
    getItem('參考資料', 'reference', undefined, [
      getItem('雜項攻略', 'game/miscGuide'),
    ]),
  ];

  return { MenuItems };
};

export default useService;

