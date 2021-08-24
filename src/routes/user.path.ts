import { defineRoute } from '$utils/api';
import { authGuard } from '@/middlewares/auth';

export const setRoute = defineRoute(async (app, path) => {
   app.get(path, authGuard, (req, res) => {
      res.send('yes it works');
   });
});
