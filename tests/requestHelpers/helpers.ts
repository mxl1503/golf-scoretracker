import request, { HttpVerb } from 'sync-request';

export function requestHelper(method: HttpVerb, path: string, payload: any) {
  let qs = {};
  let json = {};
  const headers = { token: payload.token };
  if (process.env.ITERATION === '3' && 'token' in payload) {
    delete payload.token;
  }
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const res = request(method, path, { qs, json, headers });

  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  return JSON.parse(res.getBody() as string);
}

