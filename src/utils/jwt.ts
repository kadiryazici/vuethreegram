import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

export function createJWT(
   payload: string | object | Buffer,
   secret: string,
   options: SignOptions = {}
): Promise<string> {
   return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, token) => {
         if (err) {
            return reject(err);
         }
         if (token) {
            return resolve(token);
         }
         return reject(new Error('unknown error occured'));
      });
   });
}

export function verifyJWT<T>(payload: string, secret: string, options: VerifyOptions = {}): Promise<T & JwtPayload> {
   return new Promise((resolve, reject) => {
      jwt.verify(payload, secret, options, (err, payload) => {
         if (err) {
            return reject(err);
         }
         if (payload) {
            return resolve(payload as T & JwtPayload);
         }
         return reject(new Error('unknown error occured'));
      });
   });
}

export function isExpired(msg: string | Error) {
   if (!msg) {
      return false;
   }
   const message = msg instanceof Error ? msg.message : msg;
   if (message.includes('expired')) {
      return true;
   } else {
      return false;
   }
}

export function isInvalid(msg: string | Error) {
   if (!msg) {
      return false;
   }
   const message = msg instanceof Error ? msg.message : msg;
   if (message.includes('invalid')) {
      return true;
   } else {
      return false;
   }
}
