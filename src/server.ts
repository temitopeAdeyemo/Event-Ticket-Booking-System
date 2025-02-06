import { Log } from './shared/utils/Log';

(async () => {
  try {
    const App = require('./app').default;
    const app = new App();
    app.listen();
  } catch (err: any) {
    Log.error('Something went wrong when initializing the server:\n', err.stack);
  }
})();
