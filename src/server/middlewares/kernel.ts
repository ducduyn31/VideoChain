import {Application} from 'express';

import Locals from '../providers/locals';

import Cors from './cors';
import Http from './http';
import Views from './views';
import Statics from './statics';
import StatusMonitor from './statusMonitor';
import FileUpload from './fileUpload';

class Kernel {
    public static init(_express: Application): Application {
        // Check if CORS is enabled
        if (Locals.config().isCORSEnabled) {
            // Mount CORS middleware
            _express = Cors.mount(_express);
        }

        // Mount basic express apis middleware
        _express = Http.mount(_express);

        // Mount csrf token verification middleware
        // _express = CsrfToken.mount(_express);

        // Mount view engine middleware
        _express = Views.mount(_express);

        // Mount statics middleware
        _express = Statics.mount(_express);

        // Mount file upload middleware
        _express = FileUpload.mount(_express);

        // Mount status monitor middleware
        _express = StatusMonitor.mount(_express);
        return _express;
    }
}

export default Kernel;
