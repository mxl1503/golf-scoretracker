import config from '../config.json';

export function getRoutes() {
  return {
    userRegister: `${config.url}:${config.port}/admin/auth/register`,
  };
}
