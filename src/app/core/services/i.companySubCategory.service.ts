import { CompanySubCategoryModel } from '../domain/companySubCategory.model';
import { IGenericService } from './generic/i.generic.service';

export interface ICompanySubCategoryService extends IGenericService<CompanySubCategoryModel> {
        getList(mainCategoryId: number): Promise<CompanySubCategoryModel[]>;
}