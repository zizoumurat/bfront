export interface CurrentUserModel {
  Id: number;
  name: string;
  surname: string;
  title: string;
  email: string;
  roleName: string;
  roleId: number;
  companyId: number;
  companyName: string;
  departmentId: number;
  departmentName: string;
  phoneNumber: string;
  operationOfRole: string[];
  userPhotoUrl: string;
}
