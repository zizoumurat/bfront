export interface IPostRepository<T> {
    post(item: T): Promise<void>;
    postAny(item: any, endPoint?: string)
}