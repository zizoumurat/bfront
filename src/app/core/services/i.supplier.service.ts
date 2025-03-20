import { SupplierModel, SupplierModelForCategoryModel } from '../domain/supplier.model';
import { IGenericService } from './generic/i.generic.service';

export interface ISupplierService extends IGenericService<SupplierModel> {
    getListByCategory(filters: {categoryId: number, channelType: number, cityId?: number}): Promise<SupplierModelForCategoryModel[]>;
} 