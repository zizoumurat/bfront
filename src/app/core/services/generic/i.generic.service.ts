import { PaginationResponseModel } from "../../domain/models/pagination.response.model";
import { PaginationFilterModel } from "../../domain/models/pagination.filter.model";

export interface IGenericService<T> {
    getPaginationList(filter: PaginationFilterModel, search: any | null): Promise<PaginationResponseModel<T>>;
    exportExcell(search: any | null): Promise<void>;
   
    getById(id: string): Promise<T>;

    update(model: T): Promise<void>;
    create(model: T): Promise<void>;
    delete(id: number): Promise<void>;
}
