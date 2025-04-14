import { PaginationFilterModel } from "../../domain/models/pagination.filter.model";
import { PaginationResponseModel } from "../../domain/models/pagination.response.model";

export interface IBaseService<T> {
    getAll(endPoint?: string): Promise<T[]>;
    getById(id: string): Promise<T>;
    getPaginationList(filter: PaginationFilterModel, search: any | null): Promise<PaginationResponseModel<T>>;
    getAnyList(params: string[]): Promise<any[]>;

    create(model: T): Promise<void>;
    update(model: T): Promise<void>;
    delete(id: number): Promise<void>;
}
