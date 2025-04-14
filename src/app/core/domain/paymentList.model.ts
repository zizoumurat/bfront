import { ApprovalStatus } from "../enums/request.enum";

export interface PaymentListModel {
    id: number;
    name: string;
    approvalUsers: ApproavlUser[];
}

export interface ApproavlUser {
    id: number;
    name: string;
    status: ApprovalStatus
}
