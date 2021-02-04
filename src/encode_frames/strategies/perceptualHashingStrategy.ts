import {Strategy} from './strategy';
import {EncodedValue} from '../interfaces/EncodedValue';
import {blockhashData, hammingDistance} from '../libs/blockhash';

export class PerceptualHashingStrategy implements Strategy {

    compare(value1: EncodedValue, value2: EncodedValue): number {
        return hammingDistance(value1, value2);
    }

    encode(frame: ImageData): EncodedValue {
        return blockhashData(frame, 16, 1);
    }

}
