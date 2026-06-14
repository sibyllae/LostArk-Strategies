import TheSidebar from '@/component/layout/TheSidebar';
import TheContent from '@/component/layout/TheContent';

interface ContentIn {
  Component: React.ReactNode;
}

const Content: React.FC<ContentIn> = ({ Component }: ContentIn) => {
  return (
    <div className='w-full h-full flex bg-transparent'>
      <aside className='h-full w-64 hidden xl:flex flex-col border-r border-zinc-800/50 bg-zinc-950/60 backdrop-blur-xl z-20'>
        {/* Sidebar Header Space */}
        <div className='h-16 w-full flex-none'></div>
        <div className='flex-1 w-full overflow-y-auto p-3'>
          <TheSidebar />
        </div>
      </aside>
      <section className='h-full w-full xl:w-[calc(100%-256px)] flex flex-col relative z-0'>
        <TheContent Component={Component} />
      </section>
    </div>
  );
};

export default Content;
