import { IsNotEmpty, IsString, Length, validateOrReject } from 'class-validator';
import { NoMultipleLength, TrimLength } from '$validators/customDecorators';
import { Transform, classToPlain } from 'class-transformer';

import { Api } from '@/types';
import { Constant } from '$const/index';
import { serializeUsername } from '$utils/serializeUsername';

const { password, username } = Constant.user;
export class UserDTO {
   @IsString()
   @IsNotEmpty()
   @Length(username.min, username.max)
   @TrimLength(username.min)
   @NoMultipleLength(' ', username.min)
   @Transform(({ value }) => serializeUsername(value))
   username!: string;

   @Length(password.min, password.max)
   @IsString()
   @IsNotEmpty()
   password!: string;
}

export async function validateAuthBody(payload: Api.UserPayload) {
   const userDTO = new UserDTO();
   userDTO.username = payload.username;
   userDTO.password = payload.password;

   await validateOrReject(userDTO);
   return classToPlain(userDTO) as Api.UserPayload;
}
