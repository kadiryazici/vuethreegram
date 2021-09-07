import { ErrorType } from '$const/errorTypes';
import { Msg } from '$const/msg';
import { ThrowRequest } from '$utils/api';
import { prettyLog } from '$utils/prettyLog';
import Tokens from 'csrf';
import { Request, Response, NextFunction } from 'express';

const tokens = new Tokens();
const secret = tokens.secretSync();

const SendError = (res: Response) =>
   ThrowRequest(res, {
      type: ErrorType.CSRFError,
      status: 'BadRequest',
      message: Msg.CSRFError
   });

export function csrfGuard(req: Request, res: Response, next: NextFunction) {
   const XCSRFToken = req.header('x-csrf-token');
   if (!XCSRFToken) {
      return SendError(res);
   }
   if (!tokens.verify(secret, XCSRFToken)) {
      return SendError(res);
   }
   return next();
}

export function CSRFMiddlewareGlobal(req: Request, res: Response, next: NextFunction) {
   req.createCSRFToken = () => tokens.create(secret);
   next();
}

export function logCSRFToken() {
   if (process.env.MODE === 'dev') {
      prettyLog('CSRF', tokens.create(secret));
   }
}
