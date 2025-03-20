import { Injectable, InjectionToken } from '@angular/core';
import { BudgetModel } from '../core/domain/budget.model';
import { IBudgetService } from '../core/services/i.budget.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BudgetService extends BaseService<BudgetModel> implements IBudgetService {
    constructor(protected override http: HttpClient) {
        super(http, 'Budgets');
    }

    async getAvailableBudgetList(): Promise<any> {
        const endPoint = `${BASE_URL}/${this.endPoint}/available-list`;
        return await firstValueFrom(this.http.get<any[]>(endPoint));
    }
}

export const BUDGET_SERVICE = new InjectionToken<IBudgetService>('BudgetService');
