import { PaginationFilterModel } from "../../domain/models/pagination.filter.model";
import { PaginationResponseModel } from "../../domain/models/pagination.response.model";

export interface IGetRepository<T> {
    getById(id: string): Promise<T>;
    getAll(endPoint?:string): Promise<T[]>;
    getPaginationList(filter: PaginationFilterModel, search: any | null): Promise<PaginationResponseModel<T>>;
    exportExcell(search: any | null): void;
    getAnyList(params: string[]): Promise<any>;
}