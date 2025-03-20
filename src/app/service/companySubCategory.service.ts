import { Inject, Injectable, InjectionToken } from '@angular/core';
import { CompanySubCategoryModel } from '../core/domain/companySubCategory.model';
import { ICompanySubCategoryService } from '../core/services/i.companySubCategory.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CompanySubCategoryService extends BaseService<CompanySubCategoryModel> implements ICompanySubCategoryService {

    constructor(protected override http: HttpClient) {
        super(http, 'CompanySubCategories');
    }


    async getList(mainCategoryId: number): Promise<CompanySubCategoryModel[]> {
        return await firstValueFrom(this.http.get<CompanySubCategoryModel[]>(`${BASE_URL}/${this.endPoint}/?mainCategoryId=${mainCategoryId}`));
    }
}

export const COMPANYSUBCATEGORY_SERVICE = new InjectionToken<ICompanySubCategoryService>('CompanySubCategoryService');
