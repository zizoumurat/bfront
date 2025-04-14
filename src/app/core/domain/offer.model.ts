import { OfferStatus } from "../enums/request.enum";
import { DocumentModel } from "./company.model";

export interface OfferModel {
    id: number;
    companyId: number;
    companyName: string;
    requestId: number;
    referenceCode: string;
    totalPrice: number;
    averageUnitPrice: number;
    data: string;
    maturityDays?: number;
    offerStatus: OfferStatus;
    addedToShortList: boolean;
    addedToComparisonTable: boolean;
    isRevised: boolean;
    isOptional: boolean;
    isSelected: boolean;
    rejectionReason: string;
    notes: string;
    document?: DocumentModel,
    documentUrl: string;
    offerDetails: OfferDetailModel[],
    offerDate: Date,
    expirationDate: Date,
}

export interface MakeOfferModel {
    id: number;
    requestId: number;
    priceList: number[];
    maturityDays: number;
    notes: string;
    expirationDate: Date;
}

export interface OfferDetailModel {
    id: number;
    offerId: number;
    totalPrice: number;
    unitPrice: number;
    firstUnitPrice: number;
    quantity: number;
    allocation?: number;
}