import { CompanyRequestGroupModel } from '../domain/companyRequestGroup.model';
import { IGenericService } from './generic/i.generic.service';

export interface ICompanyRequestGroupService extends IGenericService<CompanyRequestGroupModel> {
        getList(subCategoryId: number): Promise<CompanyRequestGroupModel[]>;
}