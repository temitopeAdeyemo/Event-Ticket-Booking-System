import { Log } from './shared/utils/Log';
// import { database } from './config/Database.config';
(async () => {
  try {
    const App = require('./app').default;
    const app = new App();
    await app.listen();
  } catch (err: any) {
    Log.error('Something went wrong when initializing the server:\n', err.stack);
    process.exit(1);
  }
})();
