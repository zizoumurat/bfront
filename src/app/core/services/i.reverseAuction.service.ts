import { ReverseAuctionModel } from '../domain/reverseAuction.model';
import { ReverseAuctionStatusEnum } from '../enums/request.enum';
import { IGenericService } from './generic/i.generic.service';

export interface IReverseAuctionService extends IGenericService<ReverseAuctionModel> {
    changeStatu(id: number, statu: ReverseAuctionStatusEnum, remainingSeconds: number): Promise<void>;
}