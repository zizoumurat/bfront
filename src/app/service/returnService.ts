import { Injectable, InjectionToken } from '@angular/core';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';
import { ReturnModel } from '../core/domain/return.model';
import { IReturnService } from '../core/services/i.return.service';

@Injectable({
    providedIn: 'root',
})
export class ReturnService extends BaseService<ReturnModel> implements IReturnService {

    constructor(protected override http: HttpClient) {
        super(http, 'returns');
    }

    async createReturn(data: any): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/create-return`, data))
    }

    acceptReturn(data: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export const RETURN_SERVICE = new InjectionToken<IReturnService>('ReturnService');
