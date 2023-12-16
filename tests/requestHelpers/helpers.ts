import request, { HttpVerb } from 'sync-request';
import HTTPError from 'http-errors';
import { IncomingHttpHeaders } from 'http';

const TIMEOUT_MS = 30000;

export const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: any,
  headers: IncomingHttpHeaders = {}
): any => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    qs = payload;
  } else {
    json = payload;
  }

  const res = request(method, path, { qs, json, headers, timeout: TIMEOUT_MS });

  let responseBody;
  try {
    responseBody = JSON.parse(res.body.toString());
  } catch (err) {
    if (res.statusCode === 200) {
      throw HTTPError(500,
        `Non-jsonifiable body despite code 200: '${res.body}'.\n`
      );
    }
    responseBody = { error: `Failed to parse JSON: '${err.message}'` };
  }

  const errorMessage = `[${res.statusCode}] ` + responseBody?.error || responseBody || 'No message specified!';

  switch (res.statusCode) {
    case 400: // BAD_REQUEST
    case 401: // UNAUTHORIZED
    case 403: // FORBIDDEN
      throw HTTPError(res.statusCode, errorMessage);
    case 404: // NOT_FOUND
      throw HTTPError(res.statusCode, `Cannot find '${path}' [${method}]\nReason: ${errorMessage}\n`);
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(res.statusCode, errorMessage + '\n\nServer crashed?!\n');
    default:
      if (res.statusCode !== 200) {
        throw HTTPError(res.statusCode, errorMessage + `\n\nUh oh...\n`);
      }
  }

  return responseBody;
};


