import { CategoryFindModel, CategoryModel } from '../domain/category.model';
import { IGenericService } from './generic/i.generic.service';

export interface ICategoryService extends IGenericService<CategoryModel> {
    getCategoryId(categoryFilters: { mainCategoryId: number, subCategoryId: number, requestGroupId: number }):Promise<CategoryModel>;
    importExcell(file: File): Promise<void>; 
} 