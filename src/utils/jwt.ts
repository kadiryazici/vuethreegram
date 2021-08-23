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
         return new Error('unknown error occured');
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
         return new Error('unknown error occured');
      });
   });
}

export function isExpired(msg: string) {
   if (msg.includes('expired')) {
      return true;
   } else {
      false;
   }
}

export function isInvalid(msg: string) {
   if (msg.includes('invalid')) {
      return true;
   } else {
      false;
   }
}
