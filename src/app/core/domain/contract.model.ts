import { ContractStatusEnum } from "../enums/request.enum";

export interface ContractModel {
    id: number;
    companyId: number;
    requestId: number;
    offerId: number;
    referenceCode: string;
    totalPrice: number;
    startDate: Date;
    expirationDate: Date;
    supplier: string;
    requester: string;
    currency: string;
    contractStatus:ContractStatusEnum;
    documentUrl: string;
    documentName: string;
    mimeType: string;
}