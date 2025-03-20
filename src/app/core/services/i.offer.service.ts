import { MakeOfferModel, OfferDetailModel, OfferModel } from '../domain/offer.model';
import { IGenericService } from './generic/i.generic.service';

export interface IOfferService extends IGenericService<OfferModel> {
    makeOffer(model: MakeOfferModel, document?: File): Promise<void>;
    addToShortList(offerId: number): Promise<void>;
    removeToShortList(offerId: number): Promise<void>;
    addToFavorite(offerId: number): Promise<void>;
    removeToFavorite(offerId: number): Promise<void>;
    getListByRequest(requestId: number): Promise<OfferModel[]>;
    createAllocation(requestId: number, offerDetailList: OfferDetailModel[]): Promise<void>;
    requestRevision(offerId: number): Promise<void>;
    updatePrices(payload: { offerDetailId: number; newUnitPrice: number; }[]): Promise<void>;
    rejectOffer(params: { requestId: number, rejectionReason: string }): Promise<void>;
} 