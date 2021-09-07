import { Api } from '$types';
import { ApiPath } from '/src/api/consts';
import { makeFetch } from '/src/helpers/makeFetch';

export interface MakeFetchError<T extends Object> {
   data: T;
   response: Response;
}

export async function createPost(body: FormData) {
   const [data, isError, response] = await makeFetch<Api.CreatePostResponseBody>(ApiPath('/api/createpost'), {
      method: 'POST',
      body,
      credentials: 'same-origin'
   });
   if (isError) throw { response, data };
   return data;
}
