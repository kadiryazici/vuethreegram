import { deepFreeze } from '@/helpers/utility';
import { App } from '@/types';

export const DatabaseDefaults = {
   posts: [],
   users: [],
   refreshTokens: []
} as App.Database;

export const JWTConfig = {
   expires: 15
};

export const Auth = {
   username: {
      min: 3,
      max: 15
   },
   password: {
      min: 6,
      max: 25
   }
};

export const DefaultPort = 3000;
export const BcryptSalt = 10;

export const FilePathParameterRegex = /\[(.*?)\]/g;

export function initConstants() {
   deepFreeze(DatabaseDefaults);
   deepFreeze(JWTConfig);
   deepFreeze(Auth);
}
