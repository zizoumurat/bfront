import { LocationModel } from '../domain/location.model';
import { IGenericService } from './generic/i.generic.service';

export interface ILocationService extends IGenericService<LocationModel> {}