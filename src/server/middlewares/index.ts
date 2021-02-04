import {Application} from 'express';

export interface Middleware {
    mount: (_express: Application) => Application;
}
