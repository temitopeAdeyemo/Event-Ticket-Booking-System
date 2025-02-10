import { Health } from './shared/middlewares/Health';
import { Log } from './shared/utils/Log';
(async () => {
  try {
    const App = require('./app').default;
    const app = new App();
    await app.listen();
    Health.check();
  } catch (err: any) {
    Log.error('Something went wrong when initializing the server:\n', err.stack);
    process.exit(1);
  }
})();
