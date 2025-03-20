import { ReverseAuctionStatusEnum } from "../enums/request.enum";

export interface ReverseAuctionModel {
    id: number;
    requestId: number;
    meetLink: string;
    startTime: Date;
    endTime: Date;
    showCompanyNames: boolean;
    showAllOffers: boolean;
    showOfferRankings: boolean;
    offerIdList: number[];
    times: Date[];
    minutes: number;
    statu: ReverseAuctionStatusEnum
}
