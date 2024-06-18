import { useEffect, useState } from 'react';
import useService, { AdventureBookIn } from './service';
import AdventureBookPC from './common/AdventureBookPC';
import AdventureBookMobile from './common/AdventureBookMobile';

const AdventureBook = () => {
  /**
   * hook
   */
  const { getAdventureBook } = useService();

  /**
   * state
   */
  const [adventureBookData, setAdventureBookData] = useState<AdventureBookIn[]>(
    []
  );

  /**
   * Effect
   */
  useEffect(() => {
    init();
  }, []);

  // init
  const init = async () => {
    let res = await getAdventureBook();
    setAdventureBookData(res);
  };

  return (
    <div className='w-full'>
      <div className=' flex flex-wrap'>
        <div className='flex-none w-1/2'>
          <div className='font-bold m-4 text-xl border-l-4 border-red-500'>
            <span className='px-2'>冒險之書</span>
          </div>
        </div>
      </div>
      <AdventureBookPC adventureBookData={adventureBookData} />
      <AdventureBookMobile adventureBookData={adventureBookData} />
    </div>
  );
};

// "adventureBook": "冒險之書",
// "eightyPercent": "80%",
// "fiftyPercent": "50%",
// "fortyPercent": "40%",
// "ninetyPercent": "90%",
// "seventyPercent": "70%",
// "sixtyPercent": "60%",
// "tenPercent": "10%",
// "thirtyPercent": "30%",
// "twentyPercent": "20%"

export default AdventureBook;
