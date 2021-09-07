import { defineRoute } from '$utils/api';
import { csrfGuard } from '@/middlewares/csrf';
import { Handler } from 'express';

export const setRoute = defineRoute(async (app, path) => {
   app.post(path, csrfGuard, Post());
});

function Post(): Handler {
   return (req, res) => {
      res.end();
   };
}
