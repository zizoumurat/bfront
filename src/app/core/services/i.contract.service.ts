import { ContractModel } from '../domain/contract.model';
import { ApprovalStatus } from '../enums/request.enum';
import { IGenericService } from './generic/i.generic.service';

export interface IContractService extends IGenericService<ContractModel> {
    uploadContractFileDocument(model: { id: number, startDate: Date, expirationDate: Date, file: File }): Promise<void>;
    approveRejectRequest(data: { id: number; comment: string; status: ApprovalStatus }): Promise<void>;
    addComment(data: { comment: string; contractId: number }): Promise<void>;
    getComments(contractId: number): Promise<any[]>;
}