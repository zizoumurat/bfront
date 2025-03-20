import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuItem, LazyLoadEvent } from "primeng/api";
import { PermissionModel, RoleModel } from "src/app/core/domain/role.model";
import { IRoleService } from "src/app/core/services/i.role.service";
import { ROLE_SERVICE } from "src/app/service/role.service";
import { AppTableComponent } from "../../shared/table/table.component";
import { TableMenuItem } from "../../shared/table/models/TableMenuItem";
import { FormatEnum } from "src/app/core/enums/format.enum";

@Component({
    templateUrl: "./roles.component.html",
    styleUrls: ["./roles.component.scss"],
    encapsulation: ViewEncapsulation.Emulated
})

export class RolesComponent implements OnInit {
    columns: any[];
    items: any[];
    actionItems: TableMenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any;
    totalRecords: number;
    form: FormGroup;
    filterForm: FormGroup;
    displayForm: boolean = false;
    displayPermissions: boolean = false;
    selected: boolean;
    selectedRole: RoleModel;

    allSelected: boolean = false;
    allSelectedForModule: boolean = false;
    modules: PermissionModel[] = [];
    selectedModuleIndex: number = 0;

    filterFields: any;

    @ViewChild(AppTableComponent) table!: AppTableComponent<RoleModel>;

    constructor(
        @Inject(ROLE_SERVICE) protected service: IRoleService,
        private fb: FormBuilder) { }

    async ngOnInit(): Promise<void> {

        this.columns = [
            {
                name: 'name',
                label: 'roleName',
            },
            {
                name: 'isSystemRole',
                label: 'isSystemRole',
                type: FormatEnum.yesNo
            }
        ]

        this.actionItems = [
            {
                label: 'rolePermissions', icon: 'pi pi-key', command: () => { this.showPermissions() },
            },
            {
                label: 'edit', icon: 'pi pi-pencil', command: () => { this.handleEdit() },
                handleOptions: (row: RoleModel, menuItem: TableMenuItem) => this.handleDisabled(row, menuItem),
            },
            {
                label: 'delete', icon: 'pi pi-trash', command: () => { this.delete() },
                handleOptions: (row: RoleModel, menuItem: TableMenuItem) => this.handleDisabled(row, menuItem),
            },
        ];

        this.filterFields = [
            { label: 'roleName', type: 'text', controlName: 'name' },
        ];

        this.createForm();
        this.createFilterForm();
        this.getPermissionList();
    }

    createForm() {
        this.form = this.fb.group({
            id: [0],
            name: ["", [Validators.required]]
        });
    }

    createFilterForm() {
        this.filterForm = this.fb.group({
            name: [""],
        });
    }

    toggleForm() {
        this.displayForm = !this.displayForm;
    }

    handleAdd() {
        this.selected = false;
        this.table.selectedRow = null;
        this.form.reset({ id: 0 });
        this.toggleForm();
    }

    togglePermissions() {
        this.displayPermissions = !this.displayPermissions;
    }

    showPermissions() {
        this.selected = true;
        this.selectedRole = this.table.selectedRow;
        this.selectedModuleIndex = 0;
        this.getPermissionListByRole();
        this.togglePermissions();
    }

    handleDisabled(item: RoleModel, menuItem: TableMenuItem) {
        menuItem.disabled = item.isSystemRole;
    }

    async handleEdit() {
        this.selected = true;
        this.form.patchValue(this.table.selectedRow);
        this.toggleForm();
    }

    async delete() {
        await this.service.delete(this.table.selectedRow.id);

        await this.table.refresh();
    }

    async onSubmit() {
        if (!this.form.valid)
            return;

        const data = this.form.value as RoleModel;

        if (!this.table.selectedRow)
            await this.service.create(data)
        else
            await this.service.update(data);

        this.toggleForm();

        this.table.refresh();
    }

    resetFilterForm() {
        this.searchObject = null;
        this.filterForm.reset();
    }

    submitFilter() {
        this.searchObject = this.filterForm.value;
    }

    onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.submitFilter();
    }


    //** rolePermissions */
    async getPermissionList() {
        this.modules = await this.service.getPermissions()
    }

    async getPermissionListByRole() {
        if (!this.selectedRole)
            return;

        const rolePermissions = await this.service.getPermissionsByRole(this.selectedRole.id.toString());

        this.modules = this.modules.map(module => ({
            ...module,
            actionList: module.actionList.map(action => ({
                ...action,
                isSelected: rolePermissions.some(permission => permission.id === action.id)
            }))
        }));

        this.checkIfAllSelected();
        this.checkIfAllSelectedForModule();
    }

    selectModule(index: number) {
        this.selectedModuleIndex = index;
        this.checkIfAllSelectedForModule();
    }

    toggleAllPermissions(isSelected: boolean) {
        this.modules.forEach(module => {
            module.actionList.forEach(action => {
                action.isSelected = isSelected;
            });
        });
        this.checkIfAllSelected();
        this.checkIfAllSelectedForModule();
    }

    toggleAllPermissionsForModule(isSelected: boolean) {
        this.modules[this.selectedModuleIndex].actionList.forEach(action => {
            action.isSelected = isSelected;
        });

        this.checkIfAllSelected();
        this.checkIfAllSelectedForModule();
    }

    toggleActionSelection(moduleIndex: number, actionIndex: number) {
        this.checkIfAllSelected();
        this.checkIfAllSelectedForModule();
    }

    checkIfAllSelected() {
        this.allSelected = this.modules.every(module =>
            module.actionList.every(action => action.isSelected)
        );
    }

    checkIfAllSelectedForModule() {
        this.allSelectedForModule = this.modules[this.selectedModuleIndex].actionList.every(action => action.isSelected)
    }

    async savePermissions() {
        await this.service.updateRolePermission(this.selectedRole.id, this.getSelectedActionIdList());

        this.togglePermissions();
        this.selectedRole = null;
    }

    getSelectedActionIdList(): number[] {
        return this.modules.reduce((acc, module) => {
            const selectedIds = module.actionList
                .filter(action => action.isSelected)
                .map(action => action.id);
            return acc.concat(selectedIds);
        }, []);
    }

    translateKey(action: string) {
        return 'permission.' + action;
    }

    updateSearchObject(updatedObject: any) {
        this.searchObject = updatedObject;
    }
}
