import {Middleware} from './index';
import {Application} from 'express';
import * as hbs from 'express-handlebars';
import * as path from 'path';
import Log from './log';


class Views implements Middleware {
    public mount(_express: Application): Application {
        Log.info('Booting the \'Views\' middleware');

        _express.engine('hbs', hbs({
            defaultLayout: 'main',
            extname: '.hbs',
            helpers: {
                section: function (name: string, options: any): any {
                    if (!this._sections) {
                        this._sections = {};
                    }
                    this._sections[name] = options.fn(this);
                    return null;
                }
            }
        }));
        _express.set('view engine', 'hbs');
        _express.set('views', path.join(__dirname, '../views'));

        return _express;
    }
}

export default new Views;
