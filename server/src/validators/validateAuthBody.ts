import { Auth } from '@/constants';
import { Api } from '@/types';
import { NoMultipleLength, TrimLength } from '@/validators/customValidators';
import {
   IsNotEmpty,
   IsString,
   Length,
   validateOrReject,
   isNotEmpty
} from 'class-validator';
import { Transform, classToPlain } from 'class-transformer';
import { removeSpaceDuplications } from '@/helpers/utility';

class AuthDTO implements Api.AuthBody {
   @IsString()
   @Length(Auth.username.min, Auth.username.max)
   @TrimLength(Auth.username.min)
   @NoMultipleLength(' ', Auth.username.min)
   @IsNotEmpty()
   @Transform(({ value }) => removeSpaceDuplications(value).trim(), {
      toPlainOnly: true
   })
   username!: string;

   @Length(Auth.password.min, Auth.password.max)
   @IsNotEmpty()
   @IsString()
   password!: string;
}

export async function validateAuthBody(object: Api.AuthBody) {
   const authDTO = new AuthDTO();
   authDTO.username = object?.username;
   authDTO.password = object?.password;
   try {
      await validateOrReject(authDTO);
      return classToPlain(authDTO);
   } catch (error) {
      throw new Error(error);
   }
}