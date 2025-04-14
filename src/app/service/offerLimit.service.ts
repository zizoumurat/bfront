import { Injectable, InjectionToken } from '@angular/core';
import { OfferLimitModel } from '../core/domain/offerLimit.model';
import { IOfferLimitService } from '../core/services/i.offerLimit.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base/base.service';

@Injectable({
    providedIn: 'root',
})
export class OfferLimitService extends BaseService<OfferLimitModel> implements IOfferLimitService {

    constructor(protected override http: HttpClient) {
        super(http, 'offerLimit');
    }
}

export const OFFERLIMIT_SERVICE = new InjectionToken<IOfferLimitService>('OfferLimitService');
