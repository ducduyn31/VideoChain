import {Middleware} from './index';
import {Application} from 'express';
import * as bodyParser from 'body-parser';
import Locals from '../providers/locals';
import * as cors from 'cors';
import * as session from 'express-session';
import Log from './log';

class Http implements Middleware {
    public mount(_express: Application): Application {
        Log.info('Booting the \'HTTP\' middleware');

        _express.use(bodyParser.json({
            limit: Locals.config().maxUploadLimit,
        }));

        _express.use(bodyParser.urlencoded({
            limit: Locals.config().maxUploadLimit,
            parameterLimit: Locals.config().maxParameterLimit,
            extended: false,
        }));

        _express.use(session({
            secret: Locals.config().appSecret,
            resave: true,
            saveUninitialized: true,
        }));

        _express.disable('x-powered-by');

        _express.use(cors());

        return _express;
    }
}

export default new Http;
