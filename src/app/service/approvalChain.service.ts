import { Injectable, InjectionToken } from '@angular/core';
import { ApprovalChainModel } from '../core/domain/approvalChain.model';
import { IApprovalChainService } from '../core/services/i.approvalChain.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ApprovalChainService extends BaseService<ApprovalChainModel> implements IApprovalChainService {

    constructor(protected override http: HttpClient) {
        super(http, 'ApprovalChain');
    }

}

export const APPROVALCHAIN_SERVICE = new InjectionToken<IApprovalChainService>('ApprovalChainService');
