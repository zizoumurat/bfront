import { Injectable, InjectionToken } from '@angular/core';
import { TemplateModel } from '../core/domain/template.model';
import { ITemplateService } from '../core/services/i.template.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})

export class TemplateService extends BaseService<TemplateModel> implements ITemplateService {
    constructor(protected override http: HttpClient) {
        super(http, 'template');
    }

    async getByRequestGroup(requestGroupId: number): Promise<TemplateModel[]> {
        return firstValueFrom(this.http.get<TemplateModel[]>(`${BASE_URL}/${this.endPoint}/get-by-request-group/${requestGroupId}`));
    }
}

export const TEMPLATE_SERVICE = new InjectionToken<ITemplateService>('TemplateService');