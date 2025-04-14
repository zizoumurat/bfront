import { PaginationFilterModel } from "src/app/core/domain/models/pagination.filter.model";
import { PaginationResponseModel } from "src/app/core/domain/models/pagination.response.model";
import { IDeleteRepository } from "src/app/core/repositories/generic/iDelete.repository";
import { IGetRepository } from "src/app/core/repositories/generic/iGet.repository";
import { IPostRepository } from "src/app/core/repositories/generic/iPost.repository";
import { IPutRepository } from "src/app/core/repositories/generic/iPut.repository";
import { IGenericService } from "src/app/core/services/generic/i.generic.service";


export class GenericService<T> implements IGenericService<T> {
    constructor(
        protected  getRepository: IGetRepository<T>,
        protected  postRepository: IPostRepository<T>,
        protected  putRepository: IPutRepository<T>,
        protected  deleteRepository: IDeleteRepository<T>
    ) { }

    async getAnyList(params: string[]): Promise<any[]> {
         return await this.getRepository.getAnyList(params);
    }

    async getPaginationList(
        filter: PaginationFilterModel,
        search: any | null
    ): Promise<PaginationResponseModel<T>> {
        return await this.getRepository.getPaginationList(filter, search);
    }

    async exportExcell(
        search: any | null
    ): Promise<void> {
        await this.getRepository.exportExcell(search);
    }

    async getById(id: string): Promise<T> {
        return await this.getRepository.getById(id);
    }

    async update(model: T): Promise<void> {
        await this.putRepository.put(model);
    }

    async create(model: T): Promise<void> {
        await this.postRepository.post(model);
    }

    async delete(id: number): Promise<void> {
        await this.deleteRepository.delete(id);
    }
}