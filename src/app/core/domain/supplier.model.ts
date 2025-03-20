export interface SupplierModel {
    id: number;
    companyId: number;
    name: string;
}

export interface SupplierModelForCategoryModel {
    id: number;
    name: string;
    buyersoftRating: number;
    usertRating: number;
    email: string;
    webSite: string;
    channel: number;
    isPreferred: boolean;
}