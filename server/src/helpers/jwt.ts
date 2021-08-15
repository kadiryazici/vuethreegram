import jwt, { SignOptions, JwtPayload, verify } from 'jsonwebtoken';

export async function createJWT(
   payload: Record<string, any>,
   secret: string,
   options: SignOptions = {}
): Promise<string> {
   const token: string = await new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, token) => {
         if (token) return resolve(token);
         if (err) return reject(err);
      });
   });
   return token;
}

export async function verifyJWT<T extends object>(
   token: string,
   secret: string,
   options: SignOptions = {}
) {
   type ReturnData = JwtPayload & T;
   const decoded: ReturnData = await new Promise((resolve, reject) => {
      jwt.verify(token, secret, options, (err, decodedData) => {
         if (err) return reject(err);
         if (decodedData) return resolve(decodedData as ReturnData);
      });
   });
   return decoded;
}
