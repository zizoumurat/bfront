import { Injectable, InjectionToken } from '@angular/core';
import { IOrderPreparationService } from '../core/services/i.orderPreparation.service';
import { OrderPreparationModel } from '../core/domain/orderPreparation.model';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OrderPreparationService extends BaseService<OrderPreparationModel> implements IOrderPreparationService {

    constructor(protected override http: HttpClient) {
        super(http, 'OrderPreparations');
    }

    async createOrder(data: any): Promise<void> {
        return firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/create-order`, data))

    }
}

export const ORDERPREPARATION_SERVICE = new InjectionToken<IOrderPreparationService>('OrderPreparationService');
