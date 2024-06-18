import { useEffect } from 'react';

const NotPage = () => {
  useEffect(() => {
    document.title = 'Page not found | LostArk Strategies 失落的方舟攻略網';
  }, []);

  return <h1 className='p-4 text-3xl font-bold'>Page not found</h1>;
};

export default NotPage;
