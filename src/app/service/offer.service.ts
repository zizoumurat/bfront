import { Injectable, InjectionToken } from '@angular/core';
import { MakeOfferModel, OfferDetailModel, OfferModel } from '../core/domain/offer.model';
import { IOfferService } from '../core/services/i.offer.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OfferService extends BaseService<OfferModel> implements IOfferService {

    constructor(protected override http: HttpClient) {
        super(http, 'Offers');
    }

    async getListByRequest(requestId: number): Promise<OfferModel[]> {
        return await firstValueFrom(this.http.get<any[]>(`${BASE_URL}/${this.endPoint}/get-list-by-request/${requestId}`));
    }

    async makeOffer(model: MakeOfferModel, document?: File): Promise<void> {
        const formData = new FormData();

        formData.append("requestId", model.requestId.toString());
        formData.append("maturityDays", model.maturityDays.toString());
        formData.append("notes", model.notes.toString());
        formData.append("expirationDate", model.expirationDate.toISOString());

        model.priceList.forEach((item, index) => {
            formData.append(`priceList[${index}]`, JSON.stringify(item));
        });


        if (document) {
            formData.append("document", document);
        }

        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/make-offer`, formData))
    }

    async addToShortList(offerId: number): Promise<void> {
        return firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/add-to-short-list`, { offerId }));
    }

    async removeToShortList(offerId: number): Promise<void> {
        return firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/remove-to-short-list`, { offerId }));
    }

    async addToFavorite(offerId: number): Promise<void> {
        return firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/add-to-favorite`, { offerId }));
    }

    async removeToFavorite(offerId: number): Promise<void> {
        return firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/remove-to-favorite`, { offerId }));
    }

    async createAllocation(requestId: number, offerDetailList: OfferDetailModel[]): Promise<void> {
        return firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/create-allocation`, { requestId, offerDetailList }));
    }

    async requestRevision(offerId: number): Promise<void> {
        return firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/request-revision"`, { offerId }));
    }

    async rejectOffer(params: { requestId: number, rejectionReason: string }): Promise<void> {
        return firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/reject-offer"`, params));
    }

    async updatePrices(payload: { offerDetailId: number; newUnitPrice: number; }[]): Promise<void> {
        return firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/change-prices""`, payload));
    }
}

export const OFFER_SERVICE = new InjectionToken<IOfferService>('offerService');
