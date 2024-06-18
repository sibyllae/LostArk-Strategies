import { GithubOutlined, MenuOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './TheSidebar';

interface ContentIn {
  Component: React.ReactNode;
}

const Content: React.FC<ContentIn> = ({ Component }: ContentIn) => {
  /**
   * hook
   */
  const navigate = useNavigate();
  const location = useLocation();
  /**
   * state
   */
  const [open, setOpen] = useState(false);
  /**
   * func
   */
  const onHref = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    navigate('/LostArk-Strategies/');
    e.preventDefault();
  };
  const onMenu = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setOpen(true);
    e.preventDefault();
  };

  /**
   * Effect
   */
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <>
      <div className='h-10 flex flex-wrap'>
        <div className=' flex-none w-1/4 xl:w-1/2 items-center flex'>
          <a href='/LostArk-Strategies/' onClick={onHref}>
            <h1 className='text-2xl font-bold px-4 hidden xl:flex'>
              LostArk Strategies
            </h1>
            <h1 className='text-2xl font-bold px-4 flex xl:hidden'>LAS</h1>
          </a>
        </div>
        <div className='flex-none w-3/4 xl:w-1/2 flex justify-end items-center'>
          <ul className='flex'>
            <li className='mx-8'>
              <a
                href='https://github.com/zhong1016/LostArk-Strategies'
                target={'_blank'}
              >
                <GithubOutlined style={{ fontSize: '28px', color: 'white' }} />
              </a>
            </li>
            <li className='mx-8'>
              <a
                href='#'
                className='active:relative top-1 xl:hidden'
                onClick={onMenu}
              >
                <MenuOutlined style={{ fontSize: '32px', color: 'white' }} />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='h-[calc(100%-40px)] w-full bg-black p-1 xl:p-4 overflow-y-auto'>
        <div className='w-full h-full bg-gray-500/20 rounded-md'>
          {Component}
        </div>
      </div>
      <Drawer
        placement={'right'}
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key={'right'}
        width={'70%'}
      >
        <Sidebar />
      </Drawer>
    </>
  );
};

export default Content;
