import { Response, Request } from 'express';
import { UsersModel } from '../../../models/User.model';
import { Api, ExpressServer } from '../../../types';
import bcrypt from 'bcrypt';
import { Constant } from '../../../constants';
import { validateAuthBody } from '../../../validators/user.validator';
import { usePromise } from 'vierone';

export const setRoute: ExpressServer.SetRoute = async (app, path) => {
   app.post(path, Post);
};
const InvalidBodyMessage = 'invalid body';

async function Post(req: Request, res: Response) {
   let { username, password }: Api.UserPayload = req.body;
   const [newBody, err] = await usePromise(validateAuthBody(req.body as Api.UserPayload));
   if (err) {
      return res.status(400).send(InvalidBodyMessage);
   }
   username = newBody!.username;
   password = newBody!.password;

   const hashedPassword = await bcrypt.hash(password, Constant.bcryptSalt).catch(() => {
      res.status(500).send('an error occured');
   });
   if (hashedPassword) password = hashedPassword;

   const foundUser = await UsersModel.findOne({ username });
   if (foundUser) {
      return res.status(400).send('user exists');
   }

   const user = new UsersModel({
      username,
      password
   });

   const [, userError] = await usePromise(user.save());
   if (userError) {
      return res.status(500).send('an error occured');
   }

   res.status(200).send('user has been created');
}
