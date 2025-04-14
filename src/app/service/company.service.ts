import { Injectable, InjectionToken } from '@angular/core';
import { CompanyModel } from '../core/domain/company.model';
import { ICompanyService } from '../core/services/i.company.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base/base.service';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CompanyService extends BaseService<CompanyModel> implements ICompanyService {

    constructor(protected override http: HttpClient) {
        super(http, 'Companies');
    }

    async getCompanyList(): Promise<CompanyModel[]> {
        return await firstValueFrom(this.http.get<CompanyModel[]>(`${BASE_URL}/${this.endPoint}/company-list`));
    }


    async getCurrentCompany(): Promise<CompanyModel> {
        return await firstValueFrom(this.http.get<CompanyModel>(`${BASE_URL}/${this.endPoint}/current-company`));
    }


    override async update(model: CompanyModel, logo?: File): Promise<void> {
        const formData = new FormData();
        Object.keys(model).forEach((key) => {
            formData.append(key, model[key]);
        });

        if (logo) {
            formData.append("logo", logo);
        }

        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}`, formData))
    }
}

export const COMPANY_SERVICE = new InjectionToken<ICompanyService>('CompanyService');
