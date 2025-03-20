import { Injectable, InjectionToken } from '@angular/core';
import { PermissionModel, RoleModel } from '../core/domain/role.model';
import { IRoleService } from '../core/services/i.role.service';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RoleService extends BaseService<RoleModel> implements IRoleService {

    constructor(protected override http: HttpClient) {
        super(http, 'Roles');
    }

    async getPermissions(): Promise<PermissionModel[]> {
        return firstValueFrom(this.http.get<PermissionModel[]>(`${BASE_URL}/${this.endPoint}/get-permissions"`));
    }

    async getPermissionsByRole(roleId: string): Promise<any> {
        return firstValueFrom(this.http.get<RoleModel[]>(`${BASE_URL}/${this.endPoint}/get-permissions-by-role/${roleId}`));
    }

    override async getAll(): Promise<RoleModel[]> {
        return firstValueFrom(this.http.get<RoleModel[]>(`${BASE_URL}/${this.endPoint}/get-complate-role"`));
    }

    async updateRolePermission(roleId: number, permissionIdList: number[]): Promise<void> {
        return firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/update-permissions`, { roleId, permissionIdList }))
    }
}

export const ROLE_SERVICE = new InjectionToken<IRoleService>('RoleService');
