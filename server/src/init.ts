import dotenv from 'dotenv';
import { initDB } from '@/db';
dotenv.config();
await initDB();
