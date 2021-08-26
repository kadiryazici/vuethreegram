import { defineConfig } from 'windicss/helpers';

export default defineConfig({
   shortcuts: {
      'purple-button':
         'outline-none focus:(outline-none) bg-purple-700 p-2 rounded-md border border-1px border-solid border-transparent text-white shadow-sm hover:shadow-lg transition-shadow transition-colors hover:(bg-white text-purple-700 border-purple-700) duration-300'
   }
});
