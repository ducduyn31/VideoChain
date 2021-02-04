import {EncodedValue} from '../interfaces/EncodedValue';

export interface Strategy {
    encode(frame: ImageData): EncodedValue | Promise<EncodedValue>;
    compare(value1: EncodedValue, value2: EncodedValue): number | Promise<number>;
}
