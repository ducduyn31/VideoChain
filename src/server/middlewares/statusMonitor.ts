import {Middleware} from './index';
import {Application} from 'express';
import * as expressStatusMonitor from 'express-status-monitor';
import Log from './log';
import Locals from '../providers/locals';

class StatusMonitor implements Middleware {
    public mount(_express: Application): Application {
        Log.info('Booting the \'StatusMonitor\' middleware');

        const api: string = Locals.config().apiPrefix;

        const monitorOptions: expressStatusMonitor.ExpressStatusMonitorConfig = {
            title: Locals.config().name,
            path: '/status-monitor',
            spans: [
                {
                    interval: 1,
                    retention: 60,
                },
                {
                    interval: 5,
                    retention: 60,
                },
                {
                    interval: 15,
                    retention: 60,
                },
            ],
            chartVisibility: {
                mem: true,
                rps: true,
                cpu: true,
                load: true,
                statusCodes: true,
                responseTime: true,
            },
            healthChecks: [
                {
                    protocol: 'http',
                    host: 'localhost',
                    path: '/',
                    port: '4040',
                },
                {
                    protocol: 'http',
                    host: 'localhost',
                    path: `/${api}`,
                    port: '4040',
                },
            ],
        }

        _express.use(expressStatusMonitor(monitorOptions));

        return _express;
    }

}

export default new StatusMonitor;
