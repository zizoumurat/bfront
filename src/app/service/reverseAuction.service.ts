import { Injectable, InjectionToken } from '@angular/core';
import { ReverseAuctionModel } from '../core/domain/reverseAuction.model';
import { IReverseAuctionService } from '../core/services/i.reverseAuction.service';
import { ReverseAuctionStatusEnum } from '../core/enums/request.enum';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ReverseAuctionService extends BaseService<ReverseAuctionModel> implements IReverseAuctionService {

    constructor(protected override http: HttpClient) {
        super(http, 'ReverseAuctions');
    }

    async changeStatu(id: number, statu: ReverseAuctionStatusEnum, remainingSeconds: number): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/change-statu`, { id, statu, remainingSeconds }))
    }
}

export const REVERSEAUCTION_SERVICE = new InjectionToken<ReverseAuctionService>('ReverseAuctionService');
