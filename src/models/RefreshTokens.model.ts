import { model, Schema } from 'mongoose';

interface IRefreshToken {
   token: string;
}

export const RefreshTokenSchema = new Schema(
   {
      token: String
   },
   { timestamps: true }
);
RefreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1 * 60 * 60 * 24 * 7 });

export const RefreshTokensModel = model<IRefreshToken>('refreshtokens', RefreshTokenSchema);
