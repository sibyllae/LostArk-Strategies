import TheSidebar from '@/component/layout/TheSidebar';
import TheContent from '@/component/layout/TheContent';

interface ContentIn {
  Component: React.ReactNode;
}

const Content: React.FC<ContentIn> = ({ Component }: ContentIn) => {
  return (
    <div className='w-full h-full flex '>
      <aside className='h-full w-48 hidden xl:block'>
        <div className='h-10 w-full'></div>
        <div className='h-[calc(100%-40px)] w-full'>
          <TheSidebar />
        </div>
      </aside>
      <section className='h-full w-full xl:w-[calc(100%-192px)] '>
        <TheContent Component={Component} />
      </section>
    </div>
  );
};

export default Content;
