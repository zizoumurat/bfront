import { SupplierActionModel } from '../domain/supplierAction.model';
import { IGenericService } from './generic/i.generic.service';

export interface ISupplierActionService extends IGenericService<SupplierActionModel> {
    getListByCompany(supplierId: number): Promise<SupplierActionModel[]>;
    getListBySupplier(companyId: number): Promise<SupplierActionModel[]>;
}