import { Injectable, InjectionToken } from '@angular/core';
import { SupplierActionModel } from '../core/domain/supplierAction.model';
import { ISupplierActionService } from '../core/services/i.supplierAction.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SupplierActionService extends BaseService<SupplierActionModel> implements ISupplierActionService {

    constructor(protected override http: HttpClient) {
        super(http, 'SupplierActions');
    }
    
    getListByCompany(supplierId: number): Promise<SupplierActionModel[]> {
        return firstValueFrom(this.http.get<SupplierActionModel[]>(`${BASE_URL}/${this.endPoint}/get-list-by-company/${supplierId}`));
    }
    getListBySupplier(companyId: number): Promise<SupplierActionModel[]> {
        return firstValueFrom(this.http.get<SupplierActionModel[]>(`${BASE_URL}/${this.endPoint}/get-list-by-supplier/${companyId}`));
    }

}

export const SUPPLIERACTION_SERVICE = new InjectionToken<ISupplierActionService>('SupplierActionService');
