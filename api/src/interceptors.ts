
import { Request, Response, Next } from 'restify';

/**
* Add Accept-Version header based on request path.
* If both header and path exists, path will win. 
* @param req
* @param res
* @param next
*/
export const versionHeaderUpdate = (
 req: Request,
 res: Response,
 next: Next
) => {
 let version;
 const API_VERSION_MATCH = /(api\/v\d+)/;
 const VERSION_MATCH = /(v\d+)/;

  const path = req.path();
 const apiVersionFound = path.match(API_VERSION_MATCH);

  if (apiVersionFound) {
   version = apiVersionFound[0].match(VERSION_MATCH)[0].replace('v', '');
   req.headers['accept-version'] = version;
 }

  return next();
};

/**
* Log all requests
* @param req
* @param res
* @param next
*/
export const logRquest = (req: Request, res: Response, next: Next) => {
 console.info(req.url);
 return next();
};
