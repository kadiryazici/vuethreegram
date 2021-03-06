import { defineConfig } from 'windicss/helpers';

export default defineConfig({
   shortcuts: {
      'purple-button':
         'inline-flex items-center justify-center outline-none focus:(outline-none) bg-purple-700 p-2 rounded-md border border-1px border-solid border-transparent text-white shadow-sm hover:shadow-lg transition-shadow transition-colors hover:(bg-white text-purple-700 border-purple-700) duration-300',
      'page-title': 'text-size-25px text-center py-4',
      link: 'text-violet-700 underline '
   }
});
