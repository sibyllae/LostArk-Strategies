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
  ];

  return { MenuItems };
};

export default useService;
