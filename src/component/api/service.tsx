import { AppDispatch } from '@/store';
import { setLoading } from '@/store/features/loadingSlice';
import { useDispatch } from 'react-redux';

const hostname =
  location.hostname === 'zhong1016.github.io'
    ? '/LostArk-Strategies'
    : '/public';

const baseURL = hostname + '/api/v1';

const useService = () => {
  /**
   * hook
   */
  const dispatch = useDispatch<AppDispatch>();

  // 因為只有 GET Public , 所以只微封裝 fetch
  const onFetch = async <T,>(
    api: string,
    method: 'GET' | 'POST' = 'GET',
    body?: BodyInit
  ): Promise<T> => {
    dispatch(setLoading(true));
    try {
      let res = await fetch(baseURL + api, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      return res.json();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { onFetch };
};

export default useService;
