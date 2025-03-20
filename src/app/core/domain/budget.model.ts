export interface BudgetModel {
  id: number;
  status: boolean;
  userId: number;
  userName: string;
  departmentId: number;
  currencyCode: string;
  departmentName: string;
  companyId: number;
  companyName: string;
  budgetLimit: number;
  budgetTitle: string;
  currencyId: number;
  currencyName: string;
  startDate: Date;
  endDate: Date;
}
