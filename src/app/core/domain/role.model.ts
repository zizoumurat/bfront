export interface RoleModel {
    id: number;
    name: string;
    createdDate: Date;
    isSystemRole: boolean;
    companyId: number;
}

export interface PermissionModel {
    name: string;
    isSelected: boolean;
    actionList: ActionModel[];
}

export interface ActionModel {
    id: number;
    name: string;
    key: string;
    isSelected: boolean;
}