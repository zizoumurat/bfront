export interface CompanyModel {
    id: number;
    name: string;
    cityId: number;
    districtId: number;
    address: string;
    phone: string;
    email: string;
    taxNumber: string;
    taxAdministration: number;
    logoUrl: string,
    status: boolean;
    createdDate: Date;
    isActive: boolean;
  }

  export interface DocumentModel {
    id: number;
    fileName: string;
    fileContent: Uint8Array; 
    fileType: string;
    uploadDate: string; 
    fileSize: number;
  }