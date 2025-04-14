export interface SupplierCreateModel {
    name: string;
    contactFirstName: string;
    contactLastName: string;
    email: string;
    password: string;
    rePassword: string;
    webSite: string;
    phone: string;
    address: string;
    taxAdministration: string;
    taxNumber: string;
    cityId: number;
    districtId: number;
    requestGroupIdList: number;
  }

  export interface CurrentUserModel {
    id: number;
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
  