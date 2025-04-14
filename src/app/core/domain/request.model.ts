import { RequestStateEnum } from "../enums/request.enum";
import { CategoryModel } from "./category.model";
import { TemplateModel } from "./template.model";

export interface RequestModel {
    id: number,
    companyName: string;
    title: string,
    requestCode: number,
    locationId: number,
    locationName: string,
    amount: number,
    requestedSupplyDate: Date,
    estimatedSupplyDate?: Date,
    collectionChannel?: number,
    reason: string,
    currencyId: number,
    currencyName?: string,
    code?: string,
    requestType?: number,
    templateId: number,
    createdById: number,
    createdBy: string,
    managerId: number,
    manager: string,
    approvedDate?: Date,
    budgetId: number,
    budgetName: string,
    budgetInclusionStatus: boolean,
    categoryUsers?: string[],
    categoryId: number,
    mainCategoryId: number,
    subCategoryId: number,
    requestGroupId: number,
    purchaseProcessType: number,
    state: RequestStateEnum,
    bidCollectionEndDate: Date,
    reverseAuctionId: number,
    template: TemplateModel,
    category: CategoryModel,
    technicalEvaluation: string,
    commercialEvaluation: string
}