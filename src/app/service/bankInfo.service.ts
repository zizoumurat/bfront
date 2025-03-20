import { Injectable, InjectionToken } from '@angular/core';
import { BankInfoModel } from '../core/domain/bankInfo.model';
import { IBankInfoService } from '../core/services/i.bankInfo.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base/base.service';

@Injectable({
    providedIn: 'root',
})
export class BankInfoService extends BaseService<BankInfoModel> implements IBankInfoService {
    constructor(protected override http: HttpClient) {
        super(http, 'BankInfo');
    }
}

export const BANKINFO_SERVICE = new InjectionToken<IBankInfoService>('BankInfoService');
