import { Injectable, InjectionToken } from '@angular/core';
import { ProductDefinitionModel } from '../core/domain/product-definition.model';
import { IProductDefinitionService } from '../core/services/i.product-definition.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ProductDefinitionService extends BaseService<ProductDefinitionModel> implements IProductDefinitionService {

    constructor(protected override http: HttpClient) {
        super(http, 'ProductDefinitions');
    }
}

export const PRODUCTDEFINITION_SERVICE = new InjectionToken<IProductDefinitionService>('ProductDefinitionService');
