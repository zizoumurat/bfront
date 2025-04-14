import { Inject, Injectable, InjectionToken } from '@angular/core';
import { CurrencyModel, CurrencyParameterModel, ExchangeRateModel } from '../core/domain/currencyParameter.model';
import { ICurrencyParameterService } from '../core/services/i.currencyParameter.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';


@Injectable({
    providedIn: 'root',
})

export class CurrencyParameterService extends BaseService<CurrencyParameterModel> implements ICurrencyParameterService {

    constructor(protected override http: HttpClient) {
        super(http, 'CurrencyParameters');
    }

    async getCurrencyList(): Promise<CurrencyModel[]> {
         return firstValueFrom(this.http.get<CurrencyModel[]>(`${BASE_URL}/currency/all-currency`));
    }

    async getCurrencyExchangeRates(id: number): Promise<ExchangeRateModel[]> {
        return await firstValueFrom(this.http.get<ExchangeRateModel[]>(`${BASE_URL}/currency/exchange-rates/${id}`));
    }

}

export const CURRENCYPARAMETER_SERVICE = new InjectionToken<ICurrencyParameterService>('CurrencyParameterService');
