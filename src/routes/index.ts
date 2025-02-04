import express from 'express';
import { Logger } from '../shared/utils/logger';
import { sendSuccess } from '../shared/utils/response';

const router = express.Router();

router.get('/', (req, res) => {
    setTimeout(() => {
        sendSuccess(res, 200, "Hello World!", { data: "Hello World!" });
    }, 1000);
    Logger.info("Hello world!",)
//   res.status(200).json('Hello World!');
// sendSuccess(res, 200, "Hello World!", {data: "Hello World!"});
});
// Register all module routes

export default router;
