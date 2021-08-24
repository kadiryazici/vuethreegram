import { defineRoute, Success } from '$utils/api';
import { csrfGuard } from '@/middlewares/csrf';

export const setRoute = defineRoute(async (app, path) => {
   app.get(path, csrfGuard, (req, res) => {
      return Success(res);
   });
});
