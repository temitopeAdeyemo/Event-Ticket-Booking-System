import express from 'express';
import { Logger } from '../shared/utils/logger';
import { ResponseHandler } from '../shared/utils/response';
import AppError from '../shared/utils/appError';
const {sendSuccessResponse} = ResponseHandler;
const router = express.Router();

router.get('/', (req, res) => {
    if(1) throw new AppError("Thrown err for check")
    setTimeout(() => {
        sendSuccessResponse(res, 200, "Hello World!", { data: "Hello World!" });
    }, 1000);
    Logger.info("Hello world!",)
});

export default router;
