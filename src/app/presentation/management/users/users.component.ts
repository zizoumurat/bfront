import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuItem, LazyLoadEvent } from "primeng/api";
import { UserModel } from "src/app/core/domain/user.model";
import { IUserService } from "src/app/core/services/i.user.service";
import { USER_SERVICE } from "src/app/service/user.service";
import { AppTableComponent } from "../../shared/table/table.component";
import { LISTITEM_SERVICE } from "src/app/service/listItem.service";
import { IListItemService } from "src/app/core/services/i.listItem.service";
import { ListItemModel } from "src/app/core/domain/listItem.model";
import { ROLE_SERVICE } from "src/app/service/role.service";
import { IRoleService } from "src/app/core/services/i.role.service";
import { PasswordValidator } from "src/app/core/validators/password.validator";

@Component({
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
})

export class UsersComponent implements OnInit {
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any;
    totalRecords: number;
    form: FormGroup;
    filterForm: FormGroup;
    displayForm: boolean = false;
    selected: boolean;

    departmentList: ListItemModel[];
    roleList: ListItemModel[];
    filterFields: any;

    @ViewChild(AppTableComponent) table!: AppTableComponent<UserModel>;

    constructor(
        @Inject(USER_SERVICE) protected service: IUserService,
        @Inject(ROLE_SERVICE) protected roleService: IRoleService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        private fb: FormBuilder) { }

    ngOnInit(): void {

        this.columns = [
            {
                name: 'name',
                label: 'name'
            },
            {
                name: 'surname',
                label: 'surname'
            },
            {
                name: 'title',
                label: 'businessTitle'
            },
            {
                name: 'email',
                label: 'email'
            },
            {
                name: 'departmentName',
                label: 'department'
            },
            {
                name: 'roleName',
                label: 'userRole'
            },
        ]

        this.actionItems = [
            {
                label: 'edit', icon: 'pi pi-pencil', command: () => { this.handleEdit() }
            },
            {
                label: 'delete', icon: 'pi pi-trash', command: () => { this.delete() }
            },
        ];

        this.getDepartmentList();
        this.getRoleList();

        this.filterFields = [
            { label: 'name', type: 'text', controlName: 'name' },
            { label: 'surname', type: 'text', controlName: 'surname' },
            { label: 'businessTitle', type: 'text', controlName: 'title' },
            { label: 'email', type: 'text', controlName: 'email' },
            { label: 'department', type: 'select', controlName: 'departmentId' },
            { label: 'role', type: 'select', controlName: 'roleId' }
        ];
    }

    async getDepartmentList() {
        this.departmentList = await this.listService.getSelectedItemList("department");

        const field = this.filterFields.find(field => field.controlName === 'departmentId');
        
        if (field) {
            field.options = this.departmentList;
        }
    }

    async getRoleList() {
        const result = await this.roleService.getAll();

        this.roleList = result.map(x => ({ id: x.id, name: x.name }));

        const field = this.filterFields.find(field => field.controlName === 'roleId');
        
        if (field) {
            field.options = this.roleList;
        }
    }

    createForm() {
        const required = Validators.required;

        const control = (validators: any[] = []) =>
            this.fb.nonNullable.control(null, validators);

        this.form = this.fb.group({
            id: this.fb.nonNullable.control(0),
            name: control([required]),
            surname: control([required]),
            title: control([required]),
            email: control([required, Validators.email]),
            phoneNumber: control([required]),
            departmentId: control([required]),
            roleId: control([required]),
            password: control([required, PasswordValidator.strong]),
            rePassword: control([required]),
        }, {
            validators: this.passwordMatchValidator,
        });
    }

    createEditForm() {
        this.form = this.fb.group(
            {
                id: this.fb.nonNullable.control(0),
                name: this.fb.nonNullable.control(null, Validators.required),
                surname: this.fb.nonNullable.control(null, Validators.required),
                title: this.fb.nonNullable.control(null, Validators.required),
                email: this.fb.nonNullable.control(null, [Validators.required, Validators.email]),
                phoneNumber: this.fb.nonNullable.control(null, Validators.required),
                departmentId: this.fb.nonNullable.control(null, Validators.required),
                roleId: this.fb.nonNullable.control(null, Validators.required),
            }
        );
    }

    passwordMatchValidator(formGroup: AbstractControl): { mismatch: boolean } | null {
        const password = formGroup.get('password')?.value;
        const rePassword = formGroup.get('rePassword')?.value;
        return password === rePassword ? null : { mismatch: true };
    }

    toggleForm() {
        this.displayForm = !this.displayForm;
    }


    handleAdd() {
        this.createForm();

        this.selected = false;
        this.table.selectedRow = null;
        this.toggleForm();
    }

    handleEdit() {
        this.createEditForm();

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

        const data = this.form.value as UserModel;

        if (!this.table.selectedRow)
            await this.service.create(data)
        else
            await this.service.update(data);

        this.toggleForm();

        this.table.refresh();
        this.form.reset({ id: 0 });
    }

    updateSearchObject(updatedObject: any) {
        this.searchObject = updatedObject;
    }
}
