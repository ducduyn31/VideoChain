import * as express from 'express';
import {Application} from 'express';
import Bootstrap from '../middlewares/kernel';
import Log from '../middlewares/log';
import Routes from './routes';
import Locals from './locals';
import ExceptionHandler from '../exception/handler';

class Express {
    public express: Application;

    constructor() {
        this.express = express();

        this.mountDotEnv();
        this.mountMiddlewares();
        this.mountRoutes();
    }

    private mountDotEnv(): void {
        this.express = Locals.init(this.express);
    }

    private mountMiddlewares(): void {
        this.express = Bootstrap.init(this.express);
    }

    private mountRoutes(): void {
        this.express = Routes.mountWeb(this.express);
    }

    public init(): void {
        const port: number = Locals.config().port;

        this.express.use(ExceptionHandler.clientErrorHandler);
        this.express.use(ExceptionHandler.logErrors);
        this.express.use(ExceptionHandler.errorHandler);
        this.express = ExceptionHandler.notFoundHandler(this.express);

        this.express.listen(port, () => {
            return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
        });
    }
}

export default new Express();
