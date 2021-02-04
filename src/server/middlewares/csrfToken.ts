import {Middleware} from './index';
import {Application} from 'express';
import Locals from '../providers/locals';
import * as lusca from 'lusca';
import Log from './log';

class CsrfToken implements Middleware {
    public mount(_express: Application): Application {
        Log.info('Booting the \'CSRFToken\' middleware');

        _express.set('trust proxy', 1);

        _express.use((req, res, next) => {
            // @ts-ignore
            res.locals.user = req.user;
            res.locals.app = Locals.config();
            next();
        });

        _express.use((req, res, next) => {
            const apiPrefix = Locals.config().apiPrefix;

            if (req.originalUrl.includes(`/${apiPrefix}/`)) {
                next();
            } else {
                lusca.csrf()(req, res, next);
            }
        });

        _express.use(lusca.xframe('SAMEORIGIN'));

        _express.use(lusca.xssProtection(true));

        return _express;
    }
}

export default new CsrfToken;
