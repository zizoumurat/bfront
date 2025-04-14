export interface CurrencyParameterModel {
    id: number;
    currency1Id: number;
    currency1Name: string;
    currency1Code: string;
    currency2Name: string;
    currency2Code: string;
    currency2Id: number;
    companyId: number;
    liveCurrency: number;
    exchangeRate: number;
    startDate: string;
    expiredDate: Date;
    isExpired: boolean;
  }
  
  export interface ExchangeRateModel {
    name: string;
    exchangeRate: number;
  }
  

  export interface CurrencyModel {
    id: number;
    code: string;
    name: string;
  }