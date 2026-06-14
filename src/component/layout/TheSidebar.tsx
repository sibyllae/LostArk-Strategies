import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useService from './service';

const Sidebar = () => {
  const { MenuItems } = useService();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('');
  const [openKeys, setOpenKeys] = useState(['game', 'collectibles', 'tools', 'reference']);

  const onMenu = (path: string) => {
    navigate(`/LostArk-Strategies/${path}`);
  };
  const onOpenKeys = (key: string[]) => {
    setOpenKeys(key);
  };

  useEffect(() => {
    init();
  }, [location]);

  const init = () => {
    setSelectedKey(location.pathname.replace('/LostArk-Strategies/', ''));
  };

  return (
    <Menu
      className='!bg-transparent border-none'
      onOpenChange={onOpenKeys}
      onClick={(e) => onMenu(e.key)}
      mode='inline'
      theme='dark'
      openKeys={openKeys}
      selectedKeys={[selectedKey]}
      items={MenuItems}
    />
  );
};

export default Sidebar;
