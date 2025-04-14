import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuItem, LazyLoadEvent } from "primeng/api";
import { CategoryModel } from "src/app/core/domain/category.model";
import { ICategoryService } from "src/app/core/services/i.category.service";
import { CATEGORY_SERVICE } from "src/app/service/category.service";
import { AppTableComponent } from "../../shared/table/table.component";
import { ListItemModel } from "src/app/core/domain/listItem.model";
import { IListItemService } from "src/app/core/services/i.listItem.service";
import { LISTITEM_SERVICE } from "src/app/service/listItem.service";
import { FormatEnum } from "src/app/core/enums/format.enum";
import { ICurrencyParameterService } from "src/app/core/services/i.currencyParameter.service";
import { CURRENCYPARAMETER_SERVICE } from "src/app/service/currencyParameter.service";
import { USER_SERVICE } from "src/app/service/user.service";
import { IUserService } from "src/app/core/services/i.user.service";
import { TranslateService } from "@ngx-translate/core";
import { TableMenuItem } from "../../shared/table/models/TableMenuItem";
import { PRODUCTDEFINITION_SERVICE } from "src/app/service/product-definition.service";
import { IProductDefinitionService } from "src/app/core/services/i.product-definition.service";
import { ProductDefinitionModel } from "src/app/core/domain/product-definition.model";
import { IServiceDefinitionService } from "src/app/core/services/i.service-definition.service";
import { SERVICEDEFINITION_SERVICE } from "src/app/service/service-definition.service";
import { COMPANYSUBCATEGORY_SERVICE } from "src/app/service/companySubCategory.service";
import { ICompanySubCategoryService } from "src/app/core/services/i.companySubCategory.service";
import { COMPANYREQUESTGROUP_SERVICE } from "src/app/service/companyRequestGroup.service";
import { ICompanyRequestGroupService } from "src/app/core/services/i.companyRequestGroup.service";
import { CompanySubCategoryModel } from "src/app/core/domain/companySubCategory.model";
import { CompanyRequestGroupModel } from "src/app/core/domain/companyRequestGroup.model";

@Component({
    selector: 'app-category-settings',
    templateUrl: "./category-settings.component.html",
    styleUrls: ["./category-settings.component.scss"],
})

export class CategorySettingsComponent implements OnInit {

    // Column definitions for tables
    columns: any[];
    productDefinitionColumns: any[];
    serviceDefinitionColumns: any[];
    filterFields: any;

    // Action items for tables
    actionItems: TableMenuItem[];
    productDefinitionActionItems: TableMenuItem[];
    serviceDefinitionActionItems: TableMenuItem[];

    // Data for search and table filtering
    searchObject: any;
    searcProductDefinition: any;
    searcServiceDefinition: any;
    totalRecords: number;

    // Form group definitions
    form: FormGroup;
    filterForm: FormGroup;
    productDefinitionForm: FormGroup;
    serviceDefinitionForm: FormGroup;

    companySubCategoryForm: FormGroup;
    companyRequestGroupForm: FormGroup;

    // Flags for displaying forms
    displayForm: boolean = false;
    displayProductDefinitions: boolean;
    displayProductDefinitionForm: boolean;
    displayProductDefinitionButton: boolean;
    displayServiceDefinitions: boolean;
    displayServiceDefinitionForm: boolean;
    displayServiceDefinitionButton: boolean;
    displayAddSubCategory: boolean;
    displayAddRequestGroup: boolean;
    displayImportExcell: boolean;

    // Selection flags
    selected: boolean;
    selectedProductDefinition: boolean;
    selectedServiceDefinition: boolean;

    // Lists for dropdowns and filters
    userList: ListItemModel[];
    mainCategoryList: ListItemModel[];
    subCategoryList: ListItemModel[];
    companySubCategoryList: CompanySubCategoryModel[];
    filterSubCategoryList: ListItemModel[];
    requestGroupList: ListItemModel[];
    companyRequestGroupList: CompanyRequestGroupModel[];
    locationList: ListItemModel[];
    unitList: ListItemModel[];

    // Selected currency
    selectedCurrency: string = "TRY";

    selectedFile: any | null = null;

    // Child table references
    @ViewChild('categoryTable') table!: AppTableComponent<CategoryModel>;
    @ViewChild('productDefinitionTable') productDefinitionTable!: AppTableComponent<ProductDefinitionModel>;
    @ViewChild('serviceDefinitionTable') serviceDefinitionTable!: AppTableComponent<ProductDefinitionModel>;

    constructor(
        @Inject(CATEGORY_SERVICE) protected service: ICategoryService,
        @Inject(USER_SERVICE) protected userService: IUserService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        @Inject(CURRENCYPARAMETER_SERVICE) protected currencyService: ICurrencyParameterService,
        @Inject(PRODUCTDEFINITION_SERVICE) protected productDefinitionService: IProductDefinitionService,
        @Inject(SERVICEDEFINITION_SERVICE) protected serviceDefinitionService: IServiceDefinitionService,
        @Inject(COMPANYSUBCATEGORY_SERVICE) protected companySubCategoryService: ICompanySubCategoryService,
        @Inject(COMPANYREQUESTGROUP_SERVICE) protected companyRequestGroupService: ICompanyRequestGroupService,
        private translateService: TranslateService,
        private fb: FormBuilder) { }

    async ngOnInit(): Promise<void> {
        // Initialize column and action items
        this.initializeColumns();
        this.initializeActionItems();

        // Create forms
        this.createForm();
        this.createProductDefinitionForm();
        this.createServiceDefinitionForm();
        this.createFilterForm();
        this.createCompanySubCategoryForm();
        this.createRequestGroupForm();

        this.getMainCategoryList();
        this.getOwnerUserList();
        this.getLocationList();
    }

    initializeColumns() {
        this.columns = [
            { name: "mainCategoryName", label: "mainCategory" },
            { name: "companySubCategoryName", label: "subCategory" },
            { name: "companyRequestGroupName", label: "requestGroup" },
            { name: "locationName", label: "requestLocation" },
            { name: "ownerUserList", label: "ownerUser", type: FormatEnum.userList },
            { name: "leadTime", label: "leadTime", type: FormatEnum.week },
            { name: "unit", label: "unit" },
        ];

        this.productDefinitionColumns = [
            { name: "code", label: "code" },
            { name: "definition", label: "definition" },
        ];

        this.serviceDefinitionColumns = [
            { name: "definition", label: "definition" },
        ];

        this.filterFields = [
            { label: 'mainCategory', type: 'select', controlName: 'mainCategoryId', relation: 'subCategoryId' },
            { label: 'subCategory', type: 'select', controlName: 'subCategoryId' },
            { label: 'ownerUser', type: 'select', controlName: 'userId' },
            { label: 'leadTime', type: 'text', controlName: 'leadTime', addon: 'week' }
        ];
    }

    initializeActionItems() {
        this.actionItems = [
            { label: 'edit', icon: 'pi pi-pencil', command: () => { this.handleEdit() } },
            { label: 'delete', icon: 'pi pi-trash', command: () => { this.delete() } },
        ];

        this.productDefinitionActionItems = [
            { label: 'edit', icon: 'pi pi-pencil', command: () => { this.handleEditProductDefinition() } },
            { label: 'delete', icon: 'pi pi-trash', command: () => { this.deleteProductDefinition() } },
        ];

        this.serviceDefinitionActionItems = [
            { label: 'edit', icon: 'pi pi-pencil', command: () => { this.handleEditServiceDefinition() } },
            { label: 'delete', icon: 'pi pi-trash', command: () => { this.deleteServiceDefinition() } },
        ];
    }

    // Form creation methods
    createForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators, updateOn: 'blur' });

        this.form = this.fb.group({
            id: control(0),
            mainCategoryId: control(null, [Validators.required]),
            subCategoryId: control(null, [Validators.required]),
            requestGroupId: control(null, [Validators.required]),
            locationId: control(null, [Validators.required]),
            userIdList: control(null, [Validators.required]),
            leadTime: control(null, [Validators.required]),
            unit: control(null, [Validators.required]),
        });
    }

    createCompanySubCategoryForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators });

        this.companySubCategoryForm = this.fb.group({
            id: control(0),
            subCategoryId: control(null, [Validators.required]),
            name: control(null, [Validators.required]),
        });
    }

    createRequestGroupForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators });

        this.companyRequestGroupForm = this.fb.group({
            id: control(0),
            requestGroupId: control(null, [Validators.required]),
            name: control(null, [Validators.required]),
        });
    }

    createProductDefinitionForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators });

        this.productDefinitionForm = this.fb.group({
            id: control(0),
            categoryId: control(null, [Validators.required]),
            code: control(null, [Validators.required]),
            definition: control(null, [Validators.required]),
        });
    }

    createServiceDefinitionForm() {
        const control = (defaultValue: any, validators: any[] = []) =>
            this.fb.control(defaultValue, { validators });

        this.serviceDefinitionForm = this.fb.group({
            id: control(0),
            categoryId: control(null, [Validators.required]),
            definition: control(null, [Validators.required]),
        });
    }

    createFilterForm() {
        const control = (defaultValue: any) =>
            this.fb.control(defaultValue);

        this.filterForm = this.fb.group({
            mainCategoryId: control(null),
            subCategoryId: control(null),
            userId: control(null),
            leadTime: control(null),
        });
    }

    // Table-related actions and data fetching
    toggleForm() {
        this.displayForm = !this.displayForm;
    }

    handleAdd() {
        this.selected = false;
        this.table.selectedRow = null;
        this.form.reset({ id: 0 });
        this.toggleForm();
    }

    handleAddProductDefinition() {
        this.selectedProductDefinition = false;
        this.productDefinitionTable.selectedRow = null;
        this.productDefinitionForm.reset({ id: 0, categoryId: this.table.selectedRow.id });
        this.displayProductDefinitionForm = true;
    }

    handleAddServiceDefinition() {
        this.selectedServiceDefinition = false;
        this.serviceDefinitionTable.selectedRow = null;
        this.serviceDefinitionForm.reset({ id: 0, categoryId: this.table.selectedRow.id });
        this.displayServiceDefinitionForm = true;
    }

    async handleEdit() {
        this.displayServiceDefinitionButton = false;
        this.displayProductDefinitionButton = false;
        const categorySettings = this.table.selectedRow;
        this.selected = true;
        await this.getSubCategoryList(categorySettings.mainCategoryId);
        await this.getCompanySubCategoryList(categorySettings.mainCategoryId);

        const subCategory = this.companySubCategoryList.find(x => x.id == categorySettings.subCategoryId)

        await this.getRequestGroupList(subCategory.subCategoryId.toString());

        const selectedSubCategory = this.companySubCategoryList.find(x => x.id === categorySettings.subCategoryId);

        if (selectedSubCategory) {
            await this.getCompanyRequestGroupList(selectedSubCategory.id);
        }

        if (categorySettings.mainCategoryId == 1)
            this.displayProductDefinitionButton = true;

        if (categorySettings.mainCategoryId == 2)
            this.displayServiceDefinitionButton = true;

        this.getUnits(this.table.selectedRow.mainCategoryId);

        this.form.patchValue(categorySettings);

        this.toggleForm();
    }

    async handleEditProductDefinition() {
        this.selectedProductDefinition = true;
        this.productDefinitionForm.patchValue(this.productDefinitionTable.selectedRow);
        this.displayProductDefinitionForm = true;
    }

    async handleEditServiceDefinition() {
        this.selectedServiceDefinition = true;
        this.serviceDefinitionForm.patchValue(this.serviceDefinitionTable.selectedRow);
        this.displayServiceDefinitionForm = true;
    }

    handleProductDefinition() {
        this.productDefinitionForm.patchValue({ categoryId: this.table.selectedRow.id });
        this.searcProductDefinition = { categoryId: this.table.selectedRow.id };
        this.displayProductDefinitions = true;
    }

    handleServiceDefinition() {
        this.serviceDefinitionForm.patchValue({ categoryId: this.table.selectedRow.id });
        this.searcServiceDefinition = { categoryId: this.table.selectedRow.id };
        this.displayServiceDefinitions = true;
    }

    hideServiceDefinitions(row: CategoryModel, menuItem: TableMenuItem) {
        menuItem.visible = row.mainCategoryId === 1;
    }

    hideProductDefinitions(row: CategoryModel, menuItem: TableMenuItem) {
        menuItem.visible = row.mainCategoryId === 2;
    }

    // Deletion methods
    async delete() {
        await this.service.delete(this.table.selectedRow.id);
        await this.table.refresh();
    }

    async deleteProductDefinition() {
        await this.productDefinitionService.delete(this.productDefinitionTable.selectedRow.id);
        await this.productDefinitionTable.refresh();
    }

    async deleteServiceDefinition() {
        await this.serviceDefinitionService.delete(this.serviceDefinitionTable.selectedRow.id);
        await this.serviceDefinitionTable.refresh();
    }

    // List fetching methods
    async getMainCategoryList() {
        this.mainCategoryList = await this.listService.getSelectedItemList("maincategory");

        const field = this.filterFields.find(field => field.controlName === 'mainCategoryId');

        if (field) {
            field.options = this.mainCategoryList;
        }
    }

    async getFilterSubCategoryList(mainCategoryId: string) {
        this.filterSubCategoryList = await this.listService.getSelectedItemList("subCategory", { mainCategoryId });

        const field = this.filterFields.find(field => field.controlName === 'subCategoryId');

        if (field) {
            field.options = this.filterSubCategoryList;
        }
    }

    async getSubCategoryList(mainCategoryId: string) {
        this.subCategoryList = await this.listService.getSelectedItemList("subCategory", { mainCategoryId });
    }

    async getCompanySubCategoryList(mainCategoryId: number) {
        this.companySubCategoryList = await this.companySubCategoryService.getList(mainCategoryId);
    }

    async getRequestGroupList(subCategoryId: string) {
        this.requestGroupList = await this.listService.getSelectedItemList("requestgroup", { subCategoryId });
    }

    async getCompanyRequestGroupList(subCategoryId: number) {
        this.companyRequestGroupList = await this.companyRequestGroupService.getList(subCategoryId);
    }

    async getLocationList() {
        this.locationList = await this.listService.getSelectedItemList("location");
    }

    async getOwnerUserList() {
        const users = await this.userService.getOwnerList();
        this.userList = users;

        const field = this.filterFields.find(field => field.controlName === 'userId');

        if (field) {
            field.options = users;
        }
    }

    getUnits(mainCategoryId: number) {
        const productUnits = [
            this.translateService.instant('piece'),
            this.translateService.instant('box'),
            this.translateService.instant('kilogram'),
            this.translateService.instant('ton'),
            this.translateService.instant('liter'),
            this.translateService.instant('meter'),
            this.translateService.instant('decimeter'),
            this.translateService.instant('centimeter'),
            this.translateService.instant('gram'),
            this.translateService.instant('package'),
            this.translateService.instant('set')
        ];

        const serviceUnits = [
            this.translateService.instant('hour'),
            this.translateService.instant('day'),
            this.translateService.instant('week'),
            this.translateService.instant('month'),
            this.translateService.instant('year'),
            this.translateService.instant('session'),
            this.translateService.instant('project')
        ];

        const unitOptions = {
            1: productUnits.map(unit => ({ id: unit, name: unit })),
            2: serviceUnits.map(unit => ({ id: unit, name: unit }))
        };

        this.unitList = unitOptions[mainCategoryId] || [];
    }

    // Submit form methods
    async onSubmitProductDefinitionForm() {
        if (this.productDefinitionForm.invalid) return;
        if (this.productDefinitionForm.value.id === 0) {
            await this.productDefinitionService.create(this.productDefinitionForm.value);
        } else {
            await this.productDefinitionService.update(this.productDefinitionForm.value);
        }
        this.displayProductDefinitionForm = false;
        await this.productDefinitionTable.refresh();
    }

    async onSubmitServiceDefinitionForm() {
        if (this.serviceDefinitionForm.invalid) return;
        if (this.serviceDefinitionForm.value.id === 0) {
            await this.serviceDefinitionService.create(this.serviceDefinitionForm.value);
        } else {
            await this.serviceDefinitionService.update(this.serviceDefinitionForm.value);
        }
        this.displayServiceDefinitionForm = false;
        await this.serviceDefinitionTable.refresh();
    }

    // Submit category form
    async onSubmitForm() {
        if (this.form.invalid) return;

        const formData = this.form.value as CategoryModel;

        const subCategoryId = this.companySubCategoryList.find(x => x.id === formData.subCategoryId).subCategoryId;
        const requestGorupId = this.companyRequestGroupList.find(x => x.id === formData.requestGroupId).requestGroupId;

        formData.requestGroupId = requestGorupId;
        formData.subCategoryId = subCategoryId;

        if (this.form.value.id === 0) {
            await this.service.create(formData);

            if (formData.mainCategoryId === 1)
                this.displayProductDefinitions = true;

            if (formData.mainCategoryId === 2)
                this.displayServiceDefinitionForm = true;
        } else {
            await this.service.update(formData);
        }
        this.displayForm = false;
        await this.table.refresh();
    }

    async onSubmitCompanySubCategoryForm() {
        if (this.companySubCategoryForm.invalid) return;

        await this.companySubCategoryService.create(this.companySubCategoryForm.value);
        const mainCategoryId = this.form.get('mainCategoryId').value;

        await this.getCompanySubCategoryList(mainCategoryId);

        const addedName = this.companySubCategoryForm.get('name').value;

        const added = this.companySubCategoryList.find(x => x.name === addedName);

        this.form.get('subCategoryId').setValue(added.id);

        this.companySubCategoryForm.reset({ id: 0 });
        this.displayAddSubCategory = false;
    }

    async onSubmitCompanyRequestGroupForm() {
        if (this.companyRequestGroupForm.invalid) return;

        await this.companyRequestGroupService.create(this.companyRequestGroupForm.value);
        const subCategoryId = this.form.get('subCategoryId').value;

        await this.getCompanyRequestGroupList(subCategoryId);

        const addedName = this.companyRequestGroupForm.get('name').value;
        const added = this.companyRequestGroupList.find(x => x.name === addedName);

        this.form.get('requestGroupId').setValue(added.id);

        this.displayAddRequestGroup = false;
        this.companyRequestGroupForm.reset({ id: 0 });
    }

    mainCategoryChange({ value }) {
        this.getSubCategoryList(value);
        this.getCompanySubCategoryList(value);
        this.getUnits(value);
        this.form.patchValue({
            subCategoryId: null,
            requestGroupId: null,
            unit: null
        });
    }

    subCategoryChange({ value }) {
        var subCategory = this.companySubCategoryList.find(x => x.id == value);
        this.getRequestGroupList(subCategory.subCategoryId.toString());
        this.getCompanyRequestGroupList(value);
        this.form.patchValue({
            requestGroupId: null,
        });
    }

    onSelectChange(event: { controlName: string; value: any }) {
        if (event.controlName === 'mainCategoryId') {
            this.getFilterSubCategoryList(event.value);
        }
    }

    updateSearchObject(updatedObject: any) {
        this.searchObject = updatedObject;
    }

    async exportExcell() {
        await this.service.exportExcell(this.searchObject);
    }

    async importExcel() {
        await this.service.importExcell(this.selectedFile);
        this.selectedFile = null;
        this.displayImportExcell = false;
        this.table.refresh();
    }

    onFileReceived(file: File | null): void {
        this.selectedFile = file;
    }
}
