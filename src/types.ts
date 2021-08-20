declare global {
   namespace NodeJS {
      export interface ProcessEnv {
         JWT_SECRET: string;
         JWT_REFRESH_SECRET: string;
         PORT: number;
      }
   }
}

export default {};
