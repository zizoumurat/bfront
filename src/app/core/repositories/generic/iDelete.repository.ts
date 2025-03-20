
export interface IDeleteRepository<T> {
    delete(id: number): Promise<void>;
}
