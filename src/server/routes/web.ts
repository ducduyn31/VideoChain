import {Router} from 'express';

import UploadController from '../controllers/upload';

const router = Router();

router.get('/upload', UploadController.index);
router.post('/upload', UploadController.upload);

export default router;
