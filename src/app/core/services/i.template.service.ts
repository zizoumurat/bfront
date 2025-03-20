import { TemplateModel } from '../domain/template.model';
import { IGenericService } from './generic/i.generic.service';

export interface ITemplateService extends IGenericService<TemplateModel>{
    getByRequestGroup(requestGroupId: number): Promise<TemplateModel[]>;
} 
