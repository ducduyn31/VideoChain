import {Context, Contract, Info, Transaction} from 'fabric-contract-api';
import {Frame} from './frame';

@Info({title: 'Frame', description: 'Contract for storing and finding frame'})
export class FrameContract extends Contract {

    @Transaction(true)
    public async storeFrame(ctx: Context, videoId: string, frameHash: string, frameId: number) {

    }

    @Transaction(false)
    public async findRoot(ctx: Context, frames: Frame[]) {}
}
