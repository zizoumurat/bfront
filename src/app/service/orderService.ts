import { Injectable, InjectionToken } from '@angular/core';
import { NonconformityReasonEnum, OrderListModel } from '../core/domain/orderPreparation.model';
import { IOrderService } from '../core/services/i.order.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OrderService extends BaseService<OrderListModel> implements IOrderService {

    constructor(protected override http: HttpClient) {
        super(http, 'orders');
    }

    async setNonconformity(data: { id: number; detail: string; status: NonconformityReasonEnum; }): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/set-nonconformity`, data))
    }

    async cancelOrder(id: number): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/cancel-order`, { id }))
    }

    async deliveredOrder(id: number): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/delivered-order`, { id }))
    }

    async createOrder(data: any): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/create-order`, data))
    }

    async changeOrderStatus(data: { id: number; invoiceNumber: string; waybillNumber: string; status: NonconformityReasonEnum; }): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/change-status`, data))
    }

}

export const ORDER_SERVICE = new InjectionToken<IOrderService>('OrderService');
