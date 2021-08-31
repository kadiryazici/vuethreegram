import { Api } from '$types';
import { useAsyncData } from '/src/helpers/useAsyncData';

export const getPosts = () =>
   useAsyncData<Api.PostResponse[]>('posts', 'http://localhost:3000/api/posts', {
      keepAlive: true
   });
