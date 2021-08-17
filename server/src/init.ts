import dotenv from 'dotenv';
import { initDB } from '@/db';
import { initConstants } from '@/constants';
import { prettyLog } from '@/helpers/prettyLog';
import { createCSRFToken } from '@/guards/csrfGuard';

dotenv.config();
initConstants();
await initDB();

if (process.env.MODE === 'dev') {
   prettyLog('CSRF', createCSRFToken());
}
