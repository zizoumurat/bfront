import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IGenericService } from 'src/app/core/services/generic/i.generic.service';
import { PaginationFilterModel } from 'src/app/core/domain/models/pagination.filter.model';
import { PaginationResponseModel } from 'src/app/core/domain/models/pagination.response.model';
import { BASE_URL } from 'src/environments/environment';

export class BaseService<T> implements IGenericService<T> {
    constructor(protected http: HttpClient, protected endPoint: string) {}

    async getAll(endPoint?: string): Promise<T[]> {
        const customEndPoint = endPoint ? `${this.endPoint}/${endPoint}` : this.endPoint;
        return await firstValueFrom(this.http.get<T[]>(`${BASE_URL}/${customEndPoint}`));
    }

    async getById(id: string): Promise<T> {
        return await firstValueFrom(this.http.get<T>(`${BASE_URL}/${this.endPoint}/${id}`));
    }

    async getPaginationList(filter: PaginationFilterModel, search: any | null): Promise<PaginationResponseModel<T>> {
        let params = new HttpParams()
                   .set('page', filter.page.toString())
                   .set('pageSize', filter.pageSize.toString())
                   .set('sortBy', filter.sortBy || '')
       
               filter.sortByMultiName.forEach((name, index) => {
                   params = params.append(`sortByMultiName[${index}]`, name);
               });
       
               filter.sortByMultiOrder.forEach((order, index) => {
                   params = params.append(`sortByMultiOrder[${index}]`, order.toString());
               });
       
               if (search) {
                   Object.keys(search).forEach(key => {
                       let value = search[key];
                       if (value instanceof Date) {
                           // Tarih formatını ISO string'e dönüştür
                           value = this.formatToLocalISOString(value);
                       }
                       if (value !== null && value !== undefined && value !== "" && value !== 0) {
                           params = params.set(key, value.toString());
                       }
                   });
               }
       
               return firstValueFrom(this.http.get<PaginationResponseModel<T>>(`${BASE_URL}/${this.endPoint}`, { params }));
    }

    async exportExcell(search: any | null): Promise<void> {
        await firstValueFrom(this.http.post(`${BASE_URL}/${this.endPoint}/export`, search, { responseType: 'blob' }));
    }

    async create(model: T): Promise<void> {
        await firstValueFrom(this.http.post(`${BASE_URL}/${this.endPoint}`, model));
    }

    async update(model: T): Promise<void> {
        await firstValueFrom(this.http.put(`${BASE_URL}/${this.endPoint}`, model));
    }

    async delete(id: number): Promise<void> {
        await firstValueFrom(this.http.delete(`${BASE_URL}/${this.endPoint}/${id}`));
    }

        formatToLocalISOString(date: Date): string {
        const tzOffset = date.getTimezoneOffset() * 60000; // Zaman dilimi ofsetini milisaniye cinsinden al
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, -1); // Yerel ISO string döndür
    }
}
