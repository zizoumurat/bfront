import { PermissionModel, RoleModel } from '../domain/role.model';
import { IGenericService } from './generic/i.generic.service';

export interface IRoleService extends IGenericService<RoleModel> {
    getAll(): Promise<RoleModel[]>;
    getPermissions(): Promise<PermissionModel[]>;
    getPermissionsByRole(roleId: string): Promise<any>;
    updateRolePermission(roleId: number, permissionIdList: number[]): Promise<void>;
}