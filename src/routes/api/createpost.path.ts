import { defineRoute, Success, ThrowRequest } from '$utils/api';
import { uploadMultipart } from '@/middlewares/multer';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs/promises';
import FileType from 'file-type';
import { Constant } from '$const/index';
import { usePromise } from 'vierone';
import { Msg } from '$const/msg';
import { devLog } from '$utils/devLog';

export const setRoute = defineRoute(async (app, path) => {
   const mw = uploadMultipart.single('image');
   app.post(path, mw, Post);
});

enum Err {
   FileUndefined,
   TooLargeBuffer,
   MimetypeNotSupported,
   InvalidBuffer
}

const InvalidError = (res: Response) => ThrowRequest(res, 'UnsupportedMediaType', Msg.InvalidImageFile);
const UnexpectedError = (res: Response) => ThrowRequest(res, 'InternalServerError', Msg.UnexpectedError);
const PayloadTooLargeError = (res: Response) => ThrowRequest(res, 'PayloadTooLarge', Msg.PostImageSizeTooBig);

async function checkFile(file?: Express.Multer.File) {
   const { maxImageSize, supportedMimeTypes } = Constant.post;

   if (!file) {
      throw Err.FileUndefined;
   }
   if (file.size > maxImageSize) {
      throw Err.TooLargeBuffer;
   }
   const [fileInfo, fileTypeError] = await usePromise(FileType.fromBuffer(file.buffer));
   if (!fileInfo || fileTypeError) {
      throw Err.InvalidBuffer;
   }
   if (!supportedMimeTypes.includes(fileInfo.mime)) {
      throw Err.MimetypeNotSupported;
   }
   return {
      file,
      ...fileInfo
   };
}

async function Post(req: Request, res: Response) {
   const [fileInfo, fileError] = await usePromise(checkFile(req.file));
   if (!fileInfo || fileError) {
      devLog('CreatePost: !fileInfo || fileError');
      switch (fileError as Err) {
         case Err.FileUndefined: {
            return InvalidError(res);
         }
         case Err.InvalidBuffer: {
            return InvalidError(res);
         }
         case Err.MimetypeNotSupported: {
            return InvalidError(res);
         }
         case Err.TooLargeBuffer: {
            return PayloadTooLargeError(res);
         }
         default: {
            return UnexpectedError(res);
         }
      }
   }

   const { ext } = fileInfo;
   const fileName = `${nanoid()}.${ext}`;
   const targetPath = path.join(process.cwd(), 'imgstorage', fileName);

   const [, writeFileError] = await usePromise(fs.writeFile(targetPath, fileInfo.file.buffer));
   if (writeFileError) {
      UnexpectedError(res);
   }
   return Success(res);
}
