import {IRequest, IResponse} from '../interfaces/vendors';
import {NextFunction} from 'express';
import * as fs from 'fs';
import * as _ from 'lodash';
import {UploadedFile} from 'express-fileupload';

class Upload {

    public static index(req: IRequest, res: IResponse, next: NextFunction): void {
        return res.render('upload');
    }

    public static upload(req: IRequest, res: IResponse, next: NextFunction): void {
        res.json({success: true});

        (<UploadedFile[]>req.files.videos).map((f) => {

        })

    }

}

export default Upload;
