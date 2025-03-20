import { Injectable, InjectionToken } from '@angular/core';
import { DepartmentModel } from '../core/domain/department.model';
import { ICustomerPortfolioService } from '../core/services/i.customerPortfolio.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class CustomerPortfolioService extends BaseService<DepartmentModel> implements ICustomerPortfolioService {

    constructor(protected override http: HttpClient) {
        super(http, 'SupplierCompanyPortfolio');
    }
}

export const CUSTOMERPORTFOLIO_SERVICE = new InjectionToken<ICustomerPortfolioService>('CustomerPortfolioService');
