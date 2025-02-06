import 'newrelic';
import app from './app';
import dotenv from 'dotenv';
import loadEnvVariables, { PORT } from './config';
import { connectDB } from './config/Database.config';
import { Log } from './shared/utils/Log';

dotenv.config();

loadEnvVariables();
app
  .listen(PORT, (err) => {
    if (err) {
      Log.error(`Error starting server: ${err}`);
      return;
    }
    connectDB();
    Log.info(`Server running on port ${PORT}`);
  })
  .on('error', (err) => {
    Log.error('Failed to listen', err.message);
    process.exit(1);
  });
