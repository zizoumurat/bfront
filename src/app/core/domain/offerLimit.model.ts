import { OfferStatus } from "../enums/request.enum";

export interface OfferLimitModel {
    id: number;
    companyId: number;
    currencyId: number;
    currencyName: string;
    spendLimit: number;
    minimumOfferCount: number;
}
