import { useEffect, useState } from 'react';
import FavorabilityMobile from './common/FavorabilityMobile';
import FavorabilityPC from './common/FavorabilityPC';
import useService, { FavorabilityIn } from './service';

const Favorability = () => {
  /**
   * hook
   */
  const { getFavorability, getDataSplit } = useService();

  /**
   * state
   */
  const [favorabilityData, setFavorabilityData] = useState<FavorabilityIn[]>(
    []
  );
  const [favorabilityMobileData, setFavorabilityMobileData] = useState<
    FavorabilityIn[]
  >([]);

  /**
   * Effect
   */
  useEffect(() => {
    init();
  }, []);

  // init
  const init = async () => {
    let res = await getFavorability();
    setFavorabilityMobileData(res);
    setFavorabilityData(getDataSplit(JSON.parse(JSON.stringify(res))));
  };

  return (
    <div className='w-full'>
      <div className='flex flex-wrap'>
        <div className='flex-none w-1/2'>
          <div className='font-bold m-4 text-xl border-l-4 border-rose-500'>
            <span className='px-2'>好感度</span>
          </div>
        </div>
      </div>
      <div className='px-4 pb-6'>
        <FavorabilityPC favorabilityData={favorabilityData} />
        <FavorabilityMobile favorabilityData={favorabilityMobileData} />
      </div>
    </div>
  );
};

export default Favorability;
