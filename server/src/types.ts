declare global {
   namespace NodeJS {
      interface ProcessEnv {
         JWT_SECRET: string;
         JWT_REFRESH_SECRET: string;
         PORT: number;
      }
   }
}

export namespace App {
   interface Post {
      id: string;
   }

   interface User {
      id: string;
      password: string;
      createdAt: number;
      posts: Post[];
   }

   export interface Database {
      posts: Post[];
      users: User[];
   }
}
