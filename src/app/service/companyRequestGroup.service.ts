import { Inject, Injectable, InjectionToken } from '@angular/core';
import { CompanyRequestGroupModel } from '../core/domain/companyRequestGroup.model';
import { ICompanyRequestGroupService } from '../core/services/i.companyRequestGroup.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CompanyRequestGroupService extends BaseService<CompanyRequestGroupModel> implements ICompanyRequestGroupService {

    constructor(protected override http: HttpClient) {
        super(http, 'CompanyRequestGroups');
    }


    async getList(subCategoryId: number): Promise<CompanyRequestGroupModel[]> {
        return await firstValueFrom(this.http.get<CompanyRequestGroupModel[]>(`${BASE_URL}/${this.endPoint}/?subCategoryId=${subCategoryId}`));
    }
}

export const COMPANYREQUESTGROUP_SERVICE = new InjectionToken<ICompanyRequestGroupService>('CompanyRequestGroupService');
