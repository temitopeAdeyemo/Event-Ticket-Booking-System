import 'newrelic';
import app from './app';
import dotenv from 'dotenv';
import loadEnvVariables, { PORT } from './config/initEnv';
import { connectDB } from './config/database';

dotenv.config();

connectDB();

loadEnvVariables();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
