import { SupplierPortfolioModel } from '../domain/supplierPortfolio.model';
import { IGenericService } from './generic/i.generic.service';

export interface ICustomerPortfolioService extends IGenericService<SupplierPortfolioModel> {}