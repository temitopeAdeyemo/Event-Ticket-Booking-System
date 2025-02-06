import express from 'express';
// import { Log } from '../shared/utils/Log';
import { ResponseHandler } from '../shared/utils/ResponseHandler';
import { Log } from '../shared/utils/Log';
const { sendSuccessResponse } = ResponseHandler;
const router = express.Router();

router.get('/', (req, res) => {
  setTimeout(() => {
    // if (1) throw new AppError('Thrown err for check');
    Log.info('Hello world.');
    sendSuccessResponse(res, 200, 'Hello World!', { data: 'Hello World!' });
  }, 4000);
});

export default router;
