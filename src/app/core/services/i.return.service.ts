import { ReturnModel } from '../domain/return.model';
import { IGenericService } from './generic/i.generic.service';

export interface IReturnService extends IGenericService<ReturnModel> {
    createReturn(data: any): Promise<void>;
    acceptReturn(data: any): Promise<void>;
}