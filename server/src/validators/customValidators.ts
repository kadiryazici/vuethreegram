import { verifyJWT } from '@/helpers/jwt';
import {
   registerDecorator,
   ValidationArguments,
   ValidationOptions
} from 'class-validator';

/**
 * Trims given string and checks by given min length
 */
export function TrimLength(min: number, validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
      registerDecorator({
         name: 'TrimLength',
         target: object.constructor,
         propertyName: propertyName,
         constraints: [min],
         options: validationOptions,
         validator: {
            validate(value: any, args: ValidationArguments) {
               const [min] = args.constraints as [number];
               return typeof value === 'string' && value.trim().length >= min;
            }
         }
      });
   };
}

/**
 * Counts side by side duplicates of given character as one character and checks length
 * @sample if `l` is ignored: ```hello``` -> ```helo```
 */
export function NoMultipleLength(
   char: string,
   min: number,
   validationOptions?: ValidationOptions
) {
   return function (object: Object, propertyName: string) {
      registerDecorator({
         name: 'NoMultipleLength',
         target: object.constructor,
         propertyName: propertyName,
         constraints: [char, min],
         options: validationOptions,
         validator: {
            validate(value: string, args: ValidationArguments) {
               if (typeof value !== 'string') return false;

               let [char, min] = args.constraints as [string, number];
               const reg = new RegExp(`${char}${char}+`, 'g');
               value = value.replace(reg, char);

               return value.length >= min;
            }
         }
      });
   };
}

export function IsTokenViable(
   secret: string,
   validationOptions?: ValidationOptions
) {
   return function (object: Object, propertyName: string) {
      registerDecorator({
         name: 'IsTokenViable',
         target: object.constructor,
         propertyName: propertyName,
         constraints: [secret],
         options: validationOptions,
         validator: {
            async validate(value: string, args: ValidationArguments) {
               if (typeof value !== 'string') return false;
               let [secret] = args.constraints as [string];

               try {
                  await verifyJWT(value, secret);
                  return true;
               } catch (error) {
                  return false;
               }
            }
         }
      });
   };
}
