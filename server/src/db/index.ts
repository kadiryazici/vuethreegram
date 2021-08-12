import { join } from 'path';
import { Low, JSONFile } from 'lowdb';
import { DatabaseDefaults } from '@/constants';
import { App } from '@/types';

const file = join(process.cwd(), 'prod/db.json');
const adapter = new JSONFile<App.Database>(file);
const db = new Low(adapter);

export const initDB = async () => {
   await db.read();
   db.data ||= DatabaseDefaults;
   db.write();
};

export const useDB = () => {
   return db;
};
