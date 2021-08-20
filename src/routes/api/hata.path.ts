import { ExpressServer } from '../../types';
import httpErrors from 'http-errors';

export const setRoute: ExpressServer.SetRoute = async (app, path) => {
   app.get(path, async (req, res) => {
      res.send('Hata var koçum');
   });
};
