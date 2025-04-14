import { Injectable, InjectionToken } from '@angular/core';
import { DepartmentModel } from '../core/domain/department.model';
import { ISupplierPortfolioService } from '../core/services/i.supplierPortfolio.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class SupplierPortfolioService extends BaseService<DepartmentModel> implements ISupplierPortfolioService {
    constructor(protected override http: HttpClient) {
        super(http, 'CompanySupplierPortfolio');
    }
}

export const SUPPLIERPORTFOLIO_SERVICE = new InjectionToken<ISupplierPortfolioService>('SupplierPortfolioService');
