import { OrderPreparationModel } from '../domain/orderPreparation.model';
import { IGenericService } from './generic/i.generic.service';

export interface IOrderPreparationService extends IGenericService<OrderPreparationModel> {
    createOrder(data: any): Promise<void>;
}