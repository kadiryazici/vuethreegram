import { ErrorType } from '$const/errorTypes';
import { defineRoute, Success, ThrowRequest } from '$utils/api';
import { csrfGuard } from '@/middlewares/csrf';
import { Handler } from 'express';

export const setRoute = defineRoute(async (app, path) => {
   app.get(path, csrfGuard, Get());
});

function Get(): Handler {
   return async (req, res) => {
      if (!req.user) {
         return ThrowRequest(res, {
            message: 'user is not logged in',
            status: 'Unauthorized',
            type: ErrorType.Unauthorized
         });
      }
      return Success(res);
   };
}
