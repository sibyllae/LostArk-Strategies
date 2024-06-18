import { useRoutes } from 'react-router-dom';
import Routes from './routes/index';
import useService from './service';

const RouteGuards = () => {
  const { beforeEach } = useService();

  return useRoutes(beforeEach(Routes));
};

export default RouteGuards;
