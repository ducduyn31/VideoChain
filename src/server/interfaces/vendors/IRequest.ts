import {Request} from 'express';
import {FileArray} from 'express-fileupload';

export interface IRequest extends Request {
    files?: FileArray;
}
