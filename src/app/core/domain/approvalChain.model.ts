export interface ApprovalChainModel {
    id: number;
    companyId: number;
    currencyId: number;
    currencyName: string;
    spendLimit: number;
    ownerUserList: string[];
    userIdList: number[];
}
