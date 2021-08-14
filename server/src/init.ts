import dotenv from 'dotenv';
import { initDB } from '@/db';
import { initConstants } from '@/constants';

dotenv.config();
initConstants();
await initDB();
