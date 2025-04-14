
export interface IPutRepository<T> {
    put(item: T): Promise<void>;
    putFormData(data: FormData,endPoint?: string): Promise<void>;
    putAny(item: any, endPoint?: string)
}
