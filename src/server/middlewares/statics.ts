import {Middleware} from './index';
import * as express from 'express';
import {Application} from 'express';
import * as path from 'path';
import Log from './log';

class Statics implements Middleware {
    public mount(_express: Application): Application {
        Log.info('Booting the \'Statics\' middleware');

        const options = {maxAge: 31557600000,};

        _express.use('/public', express.static(path.join(__dirname, '../../../public'), options));

        _express.use('/vendor', express.static(path.join(__dirname, '../../../node_modules'), options));

        return _express;
    }
}

export default new Statics;
