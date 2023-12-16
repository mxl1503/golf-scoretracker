import { requestHelper } from './helpers';
import { getRoutes } from './utility';

const requestUserRegister = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return requestHelper('POST', getRoutes().userRegister, { email, password, nameFirst, nameLast }, {});
};

module.exports = requestUserRegister;
