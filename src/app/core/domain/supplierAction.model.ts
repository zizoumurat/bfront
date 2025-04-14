export enum SupplierActionTypeEnum {
    Corrective = 1,
    Preventive = 2
  }
  
  export enum SupplierActionStatusEnum {
    Pending = 1,
    Started = 2,
    InProgress = 3,
    Closed = 4,
    Rejected = 5
  }
  
  export interface SupplierActionModel {
    supplierId: number;
    companyId: number;
    userId: number;
    type: SupplierActionTypeEnum;
    subject: string;
    detail: string;
    supplierNotes: string;
    dueDate: Date;
    createdAt: Date;
    supplierActionStatus: SupplierActionStatusEnum;
  }
  