import { NonconformityReasonEnum, OrderListModel } from '../domain/orderPreparation.model';
import { IGenericService } from './generic/i.generic.service';

export interface IOrderService extends IGenericService<OrderListModel> {
    createOrder(data: any): Promise<void>;
    setNonconformity(data: { id: number, detail: string, status: NonconformityReasonEnum }): Promise<void>;
    cancelOrder(id:number): Promise<void>;
    deliveredOrder(id:number): Promise<void>;
    changeOrderStatus(data: { id: number, invoiceNumber: string, waybillNumber: string, status: NonconformityReasonEnum }): Promise<void>;
}