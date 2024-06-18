import api from './api';
import useService from './service';

// 封裝 method & 引入 api
const useQuery = () => {
  const { onFetch } = useService();

  const get = async <T,>(api: string, param: string = ''): Promise<T> => {
    return onFetch<T>(api + param);
  };

  const post = async <T,>(api: string, body: BodyInit): Promise<T> => {
    return onFetch(api, 'POST', JSON.stringify(body));
  };

  return { api, get, post };
};

export default useQuery;
