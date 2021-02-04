import {Application, NextFunction, Request, Response} from 'express';
import Log from '../middlewares/log';
import Locals from '../providers/locals';

class ExceptionHandler {
    public static notFoundHandler(_express: Application): Application {
        const apiPrefix = Locals.config().apiPrefix;

        _express.use('*', ((req: Request, res: Response) => {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']`);

            if (req.xhr || req.originalUrl.includes(`/${apiPrefix}/`)) {
                return res.json({
                    error: 'Page Not Found'
                });
            } else {
                res.status(404);
                return res.render('error', {
                    title: 'Page Not Found',
                    error: [],
                });
            }
        }));

        return _express;
    }

    public static clientErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void | Response {
        Log.error(err.stack);

        if (req.xhr) {
            return res.status(500).send({error: 'Something went wrong!'});
        } else {
            return next(err);
        }
    }

    public static errorHandler(err: any, req: Request, res: Response, next: NextFunction): any {
        Log.error(err.stack);
        res.status(500);

        const apiPrefix = Locals.config().apiPrefix;

        if (req.originalUrl.includes(`/${apiPrefix}/`)) {

            if (err.name && err.name === 'UnauthorizedError') {
                const innerMessage = err.inner && err.inner.message ? err.inner.message : undefined;
                return res.json({
                    error: [
                        'Invalid Token!',
                        innerMessage,
                    ],
                });
            }

            return res.json({
                error: err,
            });
        }

        return res.render('error', { error: err.stack, title: 'Under Maintenance' });
    }

    public static logErrors(err: any, req: Request, res: Response, next: NextFunction): any {
        Log.error(err.stack);

        return next(err);
    }
}

export default ExceptionHandler;
