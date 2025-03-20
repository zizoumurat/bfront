import { CompanyModel } from '../domain/company.model';
import { IGenericService } from './generic/i.generic.service';

export interface ICompanyService extends IGenericService<CompanyModel> {
    getCurrentCompany(): Promise<CompanyModel>;
    update(model: CompanyModel, logo?: File): Promise<void>;
    getCompanyList(): Promise<CompanyModel[]>;
}