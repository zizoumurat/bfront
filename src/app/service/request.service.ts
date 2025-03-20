import { Injectable, InjectionToken } from '@angular/core';
import { IRequestService } from '../core/services/i.request.service';
import { RequestModel } from '../core/domain/request.model';
import { ApprovalStatus } from '../core/enums/request.enum';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RequestService extends BaseService<RequestModel> implements IRequestService {

    constructor(protected override http: HttpClient) {
        super(http, 'Request');
    }

    async approveRejectRequest(data: { id: number; comment: string; status: ApprovalStatus }): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/approve-reject-request`, data))
    }

    async assignManager(id: number): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/assign-manager`, { id }))
    }

    async startApprovalProcess(data: { id: number; commercialEvaluation: string; technicalEvaluation: string }): Promise<void> {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/start-approval-process`, data))
    }

    async startBidCollection(data: { request: RequestModel; providerIdList: number[]; }) {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/start`, data))
    }

    async cancelBidCollection(data: { id: number; cancellationReasion: string; }) {
        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/cancel`, data))
    }

    async createComprasionTable(data: { requestId: number; offerType: number; }) {
        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/create-comprasion-table`, data))
    }

    async createReverseAuction(data: any) {
        return await firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/create-reverse-auction`, data))
    }

}

export const REQUEST_SERVICE = new InjectionToken<IRequestService>('RequestService');
