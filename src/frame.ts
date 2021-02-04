import {Object, Property} from 'fabric-contract-api';

@Object()
export class Frame {
    @Property()
    public origin: string;

    @Property()
    public id: number;

    @Property()
    public hashValue: string;
}
