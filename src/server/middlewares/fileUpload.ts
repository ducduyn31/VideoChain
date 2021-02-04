import {Middleware} from './index';
import {Application} from 'express';
import * as fileUpload from 'express-fileupload';
import * as path from 'path';

class FileUpload implements Middleware {
    public mount(_express: Application): Application {

        _express.use(fileUpload({
            tempFileDir: path.join(__dirname, '../../../tmp/'),
            useTempFiles: true,
            debug: process.env.NODE_ENV == 'development',
        }));

        return _express;
    }
}

export default new FileUpload;
