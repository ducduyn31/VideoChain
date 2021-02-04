import * as dotenv from 'dotenv';

import Log from '../middlewares/log';
import Express from './express';
import * as path from 'path';

class AppServer {


    public loadConfiguration(): void {

        Log.info('Configuration :: Booting @ Master...')

        dotenv.config({
            path: path.join(__dirname, '../.env'),
        });

    }

    public loadServer(): void {
        Log.info('Server :: Booting @ Master...');

        Express.init();

    }

}

export default new AppServer;
