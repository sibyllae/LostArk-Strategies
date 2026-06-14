import { GithubOutlined, MenuOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './TheSidebar';

interface ContentIn {
  Component: React.ReactNode;
}

const Content: React.FC<ContentIn> = ({ Component }: ContentIn) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const onHref = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    navigate('/LostArk-Strategies/');
    e.preventDefault();
  };
  
  const onMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpen(true);
    e.preventDefault();
  };

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <div className='flex flex-col h-full w-full'>
      {/* Top Navbar with Glassmorphism */}
      <header className='h-16 flex flex-wrap items-center px-4 xl:px-8 border-b border-zinc-800/50 bg-zinc-950/60 backdrop-blur-xl z-10 sticky top-0'>
        <div className='flex-none w-1/2 flex items-center'>
          <a href='/LostArk-Strategies/' onClick={onHref} className='flex items-center gap-3 group'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all'>
              <span className='font-bold text-white text-sm'>LAS</span>
            </div>
            <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400 hidden xl:block'>
              LostArk Strategies
            </h1>
          </a>
        </div>
        <div className='flex-none w-1/2 flex justify-end items-center gap-6'>
          <a
            href='https://github.com/sibyllae/LostArk-Strategies'
            target='_blank'
            rel='noreferrer'
            className='text-zinc-400 hover:text-white transition-colors'
          >
            <GithubOutlined style={{ fontSize: '24px' }} />
          </a>
          <button
            className='active:scale-95 transition-transform xl:hidden text-zinc-400 hover:text-white'
            onClick={onMenu as any}
          >
            <MenuOutlined style={{ fontSize: '24px' }} />
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className='flex-1 w-full p-2 xl:p-6 overflow-y-auto'>
        <div className='w-full min-h-full rounded-2xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm shadow-2xl p-4 animate-slide-up'>
          {Component}
        </div>
      </main>

      <Drawer
        placement='right'
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        width='75%'
      >
        <Sidebar />
      </Drawer>
    </div>
  );
};

export default Content;
