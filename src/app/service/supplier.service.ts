import { Injectable, InjectionToken } from '@angular/core';
import { SupplierModel, SupplierModelForCategoryModel } from '../core/domain/supplier.model';
import { ISupplierService } from '../core/services/i.supplier.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './base/base.service';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SupplierService extends BaseService<SupplierModel> implements ISupplierService {

    constructor(protected override http: HttpClient) {
        super(http, 'Supplier');
    }

    getListByCategory({ categoryId, channelType, cityId }: { categoryId: number, channelType: number, cityId?: number }): Promise<SupplierModelForCategoryModel[]> {
        let parameters = new HttpParams({
            fromObject: {
                categoryId: categoryId.toString(),
                channelType: channelType?.toString(),
            }
        });

        if (cityId) {
            parameters = parameters.append('cityId', cityId.toString());
        }

        return firstValueFrom(this.http.get<SupplierModelForCategoryModel[]>(`${BASE_URL}/${this.endPoint}/get-list-by-category`, { params: parameters }));

    }
}

export const SUPPLIER_SERVICE = new InjectionToken<ISupplierService>('SupplierService');
