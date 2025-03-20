import { ServiceDefinitionModel } from '../domain/service-definition.model';
import { IGenericService } from './generic/i.generic.service';

export interface IServiceDefinitionService extends IGenericService<ServiceDefinitionModel> {}