import { requestHelper } from './helpers';
import { getRoutes } from './utility';

export const clear = () => {
  return requestHelper('DELETE', getRoutes().clear, {});
};
