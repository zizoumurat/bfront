import { BudgetModel } from '../domain/budget.model';
import { IGenericService } from './generic/i.generic.service';

export interface IBudgetService extends IGenericService<BudgetModel> {
    getAvailableBudgetList(): Promise<BudgetModel[]>;
}