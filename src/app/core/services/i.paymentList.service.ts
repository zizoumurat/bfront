import { PaymentListModel } from '../domain/paymentList.model';
import { ApprovalStatus } from '../enums/request.enum';
import { IGenericService } from './generic/i.generic.service';

export interface IPaymentListService extends IGenericService<PaymentListModel> {
    approveReject(data: { id: number; comment: string; status: ApprovalStatus }): Promise<void>;
}