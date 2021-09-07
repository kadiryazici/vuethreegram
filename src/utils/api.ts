import cookie, { CookieSerializeOptions } from 'cookie';

import { Constant } from '$const/index';
import { ErrorType } from '$const/errorTypes';
import { ExpressServer } from '@/types';
import { Response } from 'express';
import { prettyLog } from '$utils/prettyLog';

enum HttpStatus {
   OK = 200,
   Created = 201,
   Accepted = 202,
   NonAuthroitativeInformation = 203,
   NoContent = 204,
   ResetContent = 205,
   PartialContent = 206,
   MultiStatus = 207,
   AlreadyReported = 208,
   ImUsed = 226,
   MultipleChoices = 300,
   MovedPermanently = 301,
   Found = 302,
   SeeOther = 303,
   NotModified = 304,
   TemporaryRedirect = 307,
   PermanentRedirect = 308,
   BadRequest = 400,
   Unauthorized = 401,
   PaymentRequired = 402,
   Forbidden = 403,
   NotFound = 404,
   MethodNotAllowed = 405,
   NotAcceptable = 406,
   ProxyAuthenticationRequired = 407,
   RequestTimeout = 408,
   Conflict = 409,
   Gone = 410,
   LengthRequired = 411,
   PreconditionFailed = 412,
   PayloadTooLarge = 413,
   URITooLong = 414,
   UnsupportedMediaType = 415,
   RangeNotSatisfiable = 416,
   ExpectationFailed = 417,
   ImaTeaPot = 418,
   UnprocessableEntity = 422,
   Locked = 423,
   FailedDependency = 424,
   TooEarly = 425,
   UpgradeRequired = 426,
   PreconditionRequired = 428,
   TooManyRequests = 429,
   RequestHeaderFieldsTooLarge = 431,
   UnavailableForLegalReasons = 451,
   InternalServerError = 500,
   NotImplemented = 501,
   BadGateway = 502,
   ServiceUnavailable = 503,
   GatewayTimeout = 504,
   HTTPVersionNotSupported = 505,
   VariantAlsoNegotiates = 506,
   InsufficientStorage = 507,
   LoopDetected = 508,
   NotExtended = 510,
   NetworkAuthenticationRequired = 511
}

type HttpCode = keyof typeof HttpStatus;
interface SuccessOptions {
   message?: string;
   status?: HttpCode;
}
export function Success(res: Response, { status, message }: SuccessOptions = {}) {
   const statusCode = HttpStatus[status || 'OK'];
   return res.status(statusCode).send({
      statusCode,
      message: message || 'success',
      type: 'success'
   });
}

interface ThrowRequestOptions {
   message: string;
   type?: ErrorType;
   status?: HttpCode;
}
export function ThrowRequest(res: Response, { message, status, type }: ThrowRequestOptions) {
   const statusCode = HttpStatus[status || 'BadRequest'];
   return res.status(statusCode).send({
      statusCode,
      type: type || ErrorType.Error,
      message
   });
}

export function defineRoute(fn: ExpressServer.SetRoute): ExpressServer.SetRoute {
   return async (app, path) => {
      prettyLog('ROUTE', path);
      await fn(app, path);
   };
}

export function removeJWTCookies(res: Response) {
   res.clearCookie(Constant.cookies.jwtName);
   res.clearCookie(Constant.cookies.refreshTokenName);
}
