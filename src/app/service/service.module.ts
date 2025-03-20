import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USER_SERVICE, UserService } from './user.service';
import { AUTH_SERVICE, AuthService } from './auth.service';
import { LOCATION_SERVICE, LocationService } from './location.service';
import { REQUEST_SERVICE, RequestService } from './request.service';
import { TEMPLATE_SERVICE, TemplateService } from './template.service';
import { NIOTIFICATION_SERVICE, NotificationService } from './notification.service';
import { LISTITEM_SERVICE, ListItemService } from './listItem.service';
import { CATEGORY_SERVICE, CategoryService } from './category.service';
import { BUDGET_SERVICE, BudgetService } from './budget.service';
import { CURRENCYPARAMETER_SERVICE, CurrencyParameterService } from './currencyParameter.service';
import { COMPANY_SERVICE, CompanyService } from './company.service';
import { DEPARTMENT_SERVICE, DepartmentService } from './department.service';
import { ROLE_SERVICE, RoleService } from './role.service';
import { PRODUCTDEFINITION_SERVICE, ProductDefinitionService } from './product-definition.service';
import { SERVICEDEFINITION_SERVICE, ServiceDefinitionService } from './service-definition.service';
import { SUPPLIER_SERVICE, SupplierService } from './supplier.service';
import { OFFER_SERVICE, OfferService } from './offer.service';
import { OFFERLIMIT_SERVICE, OfferLimitService } from './offerLimit.service';
import { APPROVALCHAIN_SERVICE, ApprovalChainService } from './approvalChain.service';
import { BANKINFO_SERVICE, BankInfoService } from './bankInfo.service';
import { REVERSEAUCTION_SERVICE, ReverseAuctionService } from './reverseAuction.service';
import { COMPANYSUBCATEGORY_SERVICE, CompanySubCategoryService } from './companySubCategory.service';
import { COMPANYREQUESTGROUP_SERVICE, CompanyRequestGroupService } from './companyRequestGroup.service';
import { Contract_SERVICE, ContractService } from './contract.service';
import { SUPPLIERPORTFOLIO_SERVICE, SupplierPortfolioService } from './supplierPortfolio.service';
import { SUPPLIERACTION_SERVICE, SupplierActionService } from './supplierAction.service';
import { CUSTOMERPORTFOLIO_SERVICE, CustomerPortfolioService } from './customerPortfolio.service';
import { ORDERPREPARATION_SERVICE, OrderPreparationService } from './orderPreparationService';
import { ORDER_SERVICE, OrderService } from './orderService';


@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        { provide: USER_SERVICE, useClass: UserService },
        { provide: AUTH_SERVICE, useClass: AuthService },
        { provide: LOCATION_SERVICE, useClass: LocationService },
        { provide: REQUEST_SERVICE, useClass: RequestService },
        { provide: TEMPLATE_SERVICE, useClass: TemplateService },
        { provide: NIOTIFICATION_SERVICE, useClass: NotificationService },
        { provide: LISTITEM_SERVICE, useClass: ListItemService },
        { provide: CATEGORY_SERVICE, useClass: CategoryService },
        { provide: BUDGET_SERVICE, useClass: BudgetService },
        { provide: CURRENCYPARAMETER_SERVICE, useClass: CurrencyParameterService },
        { provide: COMPANY_SERVICE, useClass: CompanyService },
        { provide: DEPARTMENT_SERVICE, useClass: DepartmentService },
        { provide: ROLE_SERVICE, useClass: RoleService },
        { provide: PRODUCTDEFINITION_SERVICE, useClass: ProductDefinitionService },
        { provide: SERVICEDEFINITION_SERVICE, useClass: ServiceDefinitionService },
        { provide: SUPPLIER_SERVICE, useClass: SupplierService },
        { provide: OFFER_SERVICE, useClass: OfferService },
        { provide: OFFERLIMIT_SERVICE, useClass: OfferLimitService },
        { provide: APPROVALCHAIN_SERVICE, useClass: ApprovalChainService },
        { provide: BANKINFO_SERVICE, useClass: BankInfoService },
        { provide: REVERSEAUCTION_SERVICE, useClass: ReverseAuctionService },
        { provide: COMPANYSUBCATEGORY_SERVICE, useClass: CompanySubCategoryService },
        { provide: COMPANYREQUESTGROUP_SERVICE, useClass: CompanyRequestGroupService },
        { provide: Contract_SERVICE, useClass: ContractService },
        { provide: SUPPLIERPORTFOLIO_SERVICE, useClass: SupplierPortfolioService },
        { provide: CUSTOMERPORTFOLIO_SERVICE, useClass: CustomerPortfolioService },
        { provide: SUPPLIERACTION_SERVICE, useClass: SupplierActionService },
        { provide: ORDERPREPARATION_SERVICE, useClass: OrderPreparationService },
        { provide: ORDER_SERVICE, useClass: OrderService },
    ]
})
export class ServiceModule { }