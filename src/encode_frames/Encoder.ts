import {Strategy} from './strategies/strategy';
import {PathLike} from 'fs';
import {Buffer} from 'buffer';
import * as filetype from 'file-type';
import {PNG} from 'pngjs';
import * as jpeg from 'jpeg-js';
import * as path from 'path';
import * as fs from 'fs';
import {EncodedValue} from './interfaces/EncodedValue';

interface BufferObject {
    ext?: string;
    data: Buffer;
    name?: string;
}

enum KnownType {
    PNG,
    JPG,
    UNKNOWN,
}

export class Encoder {
    private readonly _strategy: Strategy;
    private readonly _input: PathLike;

    constructor(input: PathLike, strategy: Strategy) {
        this._input = input;
        this._strategy = strategy;
    }

    private static _isBufferObject(obj: any): obj is BufferObject {
        const casted = (obj as BufferObject);
        return Buffer.isBuffer(casted.data) || (Buffer.isBuffer(casted.data) && (casted.ext && casted.ext.length > 0));
    }

    private static async _getFileType(src: Buffer | string, data: Buffer | string): Promise<KnownType> {
        try {
            if (Buffer.isBuffer(data)) {
                const type = await filetype.fromBuffer(data);
                if (type.mime === 'image/png') return KnownType.PNG;
                else if (type.mime === 'image/jpeg') return KnownType.JPG;
                else return KnownType.UNKNOWN;
            }
            if (typeof src === 'string') {
                const ext = path.extname(src);
                const type = await filetype.fromFile(src);
                if (ext === 'png' && type.mime === 'image/png') return KnownType.PNG;
                else if ((ext === 'jpeg' || ext === 'jpg') && type.mime === 'image/jpeg') return KnownType.JPG;
                else return KnownType.UNKNOWN;
            }
            return KnownType.UNKNOWN;
        } catch (err) {
            throw err;
        }
    }

    private static _processData(buffer: Buffer, type: KnownType): ImageData {

        const _extractImageData = (decodedData: any) : ImageData => {
            return <ImageData> decodedData;
        }

        switch (type) {
            case KnownType.JPG:
                return _extractImageData(jpeg.decode(buffer));
            case KnownType.PNG:
                return _extractImageData(PNG.sync.read(buffer));
            default:
                return null;
        }
    }

    async process(): Promise<EncodedValue> {
        const bufferData = fs.readFileSync(this._input);
        const type = await Encoder._getFileType(this._input.toString(), bufferData);
        const imageData = Encoder._processData(bufferData, type);

        return this._strategy.encode(imageData);

    }
}
