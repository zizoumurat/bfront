import { Injectable, InjectionToken } from '@angular/core';
import { CategoryModel } from '../core/domain/category.model';
import { ICategoryService } from '../core/services/i.category.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './base/base.service';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends BaseService<CategoryModel> implements ICategoryService {


    constructor(protected override http: HttpClient) {
        super(http, 'Categories');
    }


    async importExcell(file: File): Promise<void> {
        const formData = new FormData();

        formData.append("excelFile", file);

        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/excel-import`, formData))
    }

    async getCategoryId({ mainCategoryId, subCategoryId, requestGroupId }: { mainCategoryId: number, subCategoryId: number, requestGroupId: number }): Promise<CategoryModel> {
        const parameters = new HttpParams({
            fromObject: {
                mainCategoryId: mainCategoryId?.toString(),
                subCategoryId: subCategoryId?.toString(),
                requestGroupId: requestGroupId?.toString()
            }
        });

        return await firstValueFrom(this.http.get<CategoryModel>(`${BASE_URL}/${this.endPoint}/find-category`, { params: parameters }));
    }
}

export const CATEGORY_SERVICE = new InjectionToken<ICategoryService>('CategoryService');
