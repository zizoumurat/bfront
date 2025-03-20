import { Injectable, InjectionToken } from '@angular/core';
import { ServiceDefinitionModel } from '../core/domain/service-definition.model';
import { IServiceDefinitionService } from '../core/services/i.service-definition.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base/base.service';

@Injectable({
    providedIn: 'root',
})
export class ServiceDefinitionService extends BaseService<ServiceDefinitionModel> implements IServiceDefinitionService {
    constructor(protected override http: HttpClient) {
        super(http, 'ServiceDefinitions');
    }
}

export const SERVICEDEFINITION_SERVICE = new InjectionToken<IServiceDefinitionService>('ServiceDefinitionService');
