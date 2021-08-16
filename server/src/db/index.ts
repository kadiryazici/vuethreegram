import { join } from 'path';
import { Low, JSONFile } from 'lowdb';
import { DatabaseDefaults } from '@/constants';
import { App } from '@/types';

const file = join(process.cwd(), `static/${process.env.MODE}/db.json`);
const adapter = new JSONFile<App.Database>(file);
const db = new Low(adapter);

export const initDB = async () => {
   if (process.env.MODE === 'test') {
      await db.read();
      db.data = DatabaseDefaults;
      db.write();
      return;
   }

   await db.read();
   db.data ||= DatabaseDefaults;
   db.write();
};

export const useDB = () => {
   return db;
};
