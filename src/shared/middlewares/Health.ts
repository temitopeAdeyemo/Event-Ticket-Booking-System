import cron from 'node-cron';
import axios from 'axios';
import { BASE_URL, HEALTH_CRON } from '../../config';
import { Log } from '../utils/Log';

export class Health {
  public static async check() {
    console.log('************************************');
    cron.schedule(HEALTH_CRON, async () => {
      try {
        await axios.get(BASE_URL + '/api/v1/health-check');
        Log.info('Ping successful');
      } catch (error: any) {
        Log.error('Ping failed:', error?.data?.message);
      }
    });
  }
}
