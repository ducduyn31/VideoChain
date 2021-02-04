import {Application} from 'express';
import Log from '../middlewares/log';

import webRouter from '../routes/web';

class Routes {

    public mountWeb(_express: Application): Application {
        Log.info('Routes :: Mounting Web Routes');

        return _express.use('/', webRouter);
    }

}

export default new Routes;
