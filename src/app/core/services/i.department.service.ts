import { DepartmentModel } from '../domain/department.model';
import { IGenericService } from './generic/i.generic.service';

export interface IDepartmentService extends IGenericService<DepartmentModel> {}