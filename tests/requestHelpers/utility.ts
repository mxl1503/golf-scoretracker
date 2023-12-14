import config from '../config.json';

export function getRoutes() {
  return {
    clear: `${config.url}:${config.port}/clear`,
  };
}
