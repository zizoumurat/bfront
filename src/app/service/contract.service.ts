import { Injectable, InjectionToken } from '@angular/core';
import { ContractModel } from '../core/domain/contract.model';
import { IContractService } from '../core/services/i.contract.service';
import { ApprovalStatus } from '../core/enums/request.enum';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ContractService extends BaseService<ContractModel> implements IContractService {

    constructor(protected override http: HttpClient) {
        super(http, 'Contracts');
    }

    async uploadContractFileDocument(model: { id: number; startDate: Date; expirationDate: Date; file: File; }): Promise<void> {
        const formData = new FormData();

        formData.append("id", model.id.toString());
        formData.append("startDate", model.startDate.toISOString());
        formData.append("expirationDate", model.expirationDate.toISOString());

        if (model.file) {
            formData.append("file", model.file);
        }

        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/upload-contract-file`, formData))
    }

    async approveRejectRequest(data: { id: number; comment: string; status: ApprovalStatus }): Promise<void> {
        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/approve-reject-contract`, data))
    }

    async addComment(data: { comment: string; contractId: number; }): Promise<void> {
        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/add-comment`, data))
    }

    async getComments(contractId: number): Promise<any[]> {
        return await firstValueFrom(this.http.get<any[]>(`${BASE_URL}/${this.endPoint}/comments/${contractId}`));
    }
}

export const Contract_SERVICE = new InjectionToken<IContractService>('ContractService');
