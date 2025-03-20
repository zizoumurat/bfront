import { CurrencyModel, CurrencyParameterModel, ExchangeRateModel } from '../domain/currencyParameter.model';
import { IGenericService } from './generic/i.generic.service';

export interface ICurrencyParameterService  extends IGenericService<CurrencyParameterModel> {
    getCurrencyExchangeRates(id: number): Promise<ExchangeRateModel[]>;
    getCurrencyList(): Promise<CurrencyModel[]>;
}