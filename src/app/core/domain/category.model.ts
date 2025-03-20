export interface CategoryModel  {
    id: number;
    companyId: number;
    mainCategoryId: number;
    mainCategoryName: string;
    subCategoryId: number;
    companySubCategoryId: number;
    subCategoryName: string;
    companySubCategoryName: string;
    subCategoryCode: string;
    requestGroupId: number;
    companyRequestGroupId: number;
    requestGroupName: string;
    companyRequestGroupName: string;
    locationId: number;
    locationName: string;
    userId: number;
    permittedUserName: string;
    leadTime: number;
  }
  
  export interface CategoryFindModel {
    id: number;
    unit: string;
    location: string;
  }