import { Injectable, InjectionToken } from '@angular/core';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { PaymentListModel } from '../core/domain/paymentList.model';
import { IPaymentListService } from '../core/services/i.paymentList.service';
import { ApprovalStatus } from '../core/enums/request.enum';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PaymentListService extends BaseService<PaymentListModel> implements IPaymentListService {

    constructor(protected override http: HttpClient) {
        super(http, 'PaymentLists');
    }

    async approveReject(data: { id: number; comment: string; status: ApprovalStatus; }): Promise<void> {
        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/approve-reject-payment-list`, data))
    }
}

export const PAYMETNLIST_SERVICE = new InjectionToken<IPaymentListService>('PaymentListService');
