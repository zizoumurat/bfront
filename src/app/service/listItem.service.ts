// Location.service.ts
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { IListItemService } from '../core/services/i.listItem.service';
import { ListItemModel } from '../core/domain/listItem.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ListItemService implements IListItemService {

    constructor(protected http: HttpClient) {
    }

    async getPublicSelectedItemList(entityName: string, filters?: { [key: string]: string; }): Promise<ListItemModel[]> {
        const url = `${BASE_URL}/publicList/${entityName}`;
        let params = new HttpParams();

        if (!!filters) {
            for (const key in filters) {
                if (filters.hasOwnProperty(key)) {
                    params = params.append(key, filters[key]);
                }
            }
        }
        return await firstValueFrom(this.http.get<ListItemModel[]>(url, { params }));
    }


    async getSelectedItemList(entityName: string, filters?: { [key: string]: string; }): Promise<ListItemModel[]> {
        const url = `${BASE_URL}/list/${entityName}`;
        let params = new HttpParams();

        if (!!filters) {
            for (const key in filters) {
                if (filters.hasOwnProperty(key)) {
                    params = params.append(key, filters[key]);
                }
            }
        }
        return await firstValueFrom(this.http.get<ListItemModel[]>(url, { params }));
    }

}

export const LISTITEM_SERVICE = new InjectionToken<IListItemService>('ListItemService');
