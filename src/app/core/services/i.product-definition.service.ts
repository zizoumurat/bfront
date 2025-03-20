import { ProductDefinitionModel } from '../domain/product-definition.model';
import { IGenericService } from './generic/i.generic.service';

export interface IProductDefinitionService extends IGenericService<ProductDefinitionModel> {}