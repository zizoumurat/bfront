import { ApprovalStatus } from "../enums/request.enum";

export interface ReturnModel {
  id: number;
  orderId: number;
  invoiceNumber: string;
  waybillNumber: string;
  reason: string;
  returnDate: Date;
  totalPrice: number;
  approvalStatus: ApprovalStatus;
  returnItems: ReturnItemModel[];
}

export interface ReturnItemModel {
  id: number;
  returnId: number;
  orderItemId: number;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
}