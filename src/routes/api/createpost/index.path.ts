import { Request, Response } from 'express';
import { Success, ThrowRequest, defineRoute } from '$utils/api';

import { Api } from '@/types';
import { Constant } from '$const/index';
import { ErrorType } from '$const/errorTypes';
import FileType from 'file-type';
import { Msg } from '$const/msg';
import { PostModel } from '$models/Post.model';
import { devLog } from '$utils/devLog';
import fs from 'fs/promises';
import { mw_AuthNeeded } from '@/middlewares/auth';
import { nanoid } from 'nanoid';
import path from 'path';
import { uploadMultipart } from '@/middlewares/multer';
import { usePromise } from 'vierone';

export const setRoute = defineRoute(async (app, path) => {
   const mw = uploadMultipart.single('image');
   app.post(path, mw_AuthNeeded, mw, Post);
});

enum Err {
   FileUndefined,
   TooLargeBuffer,
   MimetypeNotSupported,
   InvalidBuffer
}

const InvalidError = (res: Response) =>
   ThrowRequest(res, {
      status: 'UnsupportedMediaType',
      message: Msg.InvalidImageFile,
      type: ErrorType.InvalidImageFile
   });
const UnexpectedError = (res: Response) =>
   ThrowRequest(res, {
      status: 'InternalServerError',
      message: Msg.UnexpectedError,
      type: ErrorType.UnexpectedError
   });
const PayloadTooLargeError = (res: Response) =>
   ThrowRequest(res, {
      status: 'PayloadTooLarge',
      message: Msg.PostImageSizeTooBig,
      type: ErrorType.PostImageSizeTooBig
   });

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

   const { content = '' } = req.body as Api.CreatePostRequestBody;
   const post = new PostModel({
      content,
      image: `${Constant.post.imgStartUrl}/${fileName}`,
      postedBy: req.user!._id!
   });

   const [newPost, postSaveError] = await usePromise(post.save());
   if (!newPost || postSaveError) {
      return UnexpectedError(res);
   }

   const [, writeFileError] = await usePromise(fs.writeFile(targetPath, fileInfo.file.buffer));
   if (writeFileError) {
      return UnexpectedError(res);
   }
   return res.json({
      postID: newPost._id
   } as Api.CreatePostResponseBody);
}
