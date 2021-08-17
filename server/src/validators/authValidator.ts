import { Api } from '@/types';
import { IsString, validateOrReject, IsOptional } from 'class-validator';
import { JWTConfig } from '@/constants';
import { IsTokenViable } from '@/validators/customValidators';
import httpErrors from 'http-errors';
import { useDB } from '@/db';

class AuthValidatorDTO {
   @IsString()
   @IsTokenViable(process.env.JWT_SECRET)
   [JWTConfig.jwtCookieName]: string;

   @IsOptional()
   @IsString()
   @IsTokenViable(process.env.JWT_REFRESH_SECRET)
   [JWTConfig.refreshCookieName]?: string;
}

export async function validateAuth(
   payload: Api.TokenPayload,
   validateRefresh = false
) {
   const dto = new AuthValidatorDTO();

   if (validateRefresh) {
      const db = useDB();
      const isValidRefreshToken = db.data?.refreshTokens.includes(
         payload.ref_token || '__qq__xx__'
      );
      if (!isValidRefreshToken) {
         throw new httpErrors.BadRequest('invalid refresh token');
      }
      dto[JWTConfig.refreshCookieName] = payload.ref_token;
   }

   dto[JWTConfig.jwtCookieName] = payload.jwt;
   await validateOrReject(dto).catch((err) => {
      throw new httpErrors.Unauthorized('user login needed');
   });
}
