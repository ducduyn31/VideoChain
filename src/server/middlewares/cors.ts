import * as cors from 'cors';

import {Middleware} from './index';
import Locals from '../providers/locals';
import {Application} from 'express';
import Log from './log';

class Cors implements Middleware {
    public mount(_express: Application): Application {
        Log.info('Booting the \'CORS\' middleware');

        const options = {
            origin: Locals.config().url,
            optionsSuccessStatus: 200,
        }
        _express.use(cors(options));
        return _express;
    }

}

export default new Cors;
