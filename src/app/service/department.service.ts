import { Injectable, InjectionToken } from '@angular/core';
import { DepartmentModel } from '../core/domain/department.model';
import { IDepartmentService } from '../core/services/i.department.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class DepartmentService extends BaseService<DepartmentModel> implements IDepartmentService {

    constructor(protected override http: HttpClient) {
        super(http, 'Departments');
    }
}

export const DEPARTMENT_SERVICE = new InjectionToken<IDepartmentService>('DepartmentService');
