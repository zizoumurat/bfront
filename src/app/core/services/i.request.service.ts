import { RequestModel } from '../domain/request.model';
import { ApprovalStatus } from '../enums/request.enum';
import { IGenericService } from './generic/i.generic.service';

export interface IRequestService extends IGenericService<RequestModel> {
    assignManager(id: number): Promise<void>;
    startBidCollection(data: { request: RequestModel, providerIdList: number[] })
    cancelBidCollection(data: { id: number; cancellationReasion: string; })
    createComprasionTable(data: { requestId: number, offerType: number })
    startApprovalProcess(data: { id: number; commercialEvaluation: string; technicalEvaluation: string }): Promise<void>;
    approveRejectRequest(data: { id: number; comment: string; status: ApprovalStatus }): Promise<void>;
}