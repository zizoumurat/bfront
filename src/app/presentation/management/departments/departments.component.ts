import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuItem, LazyLoadEvent } from "primeng/api";
import { DepartmentModel } from "src/app/core/domain/department.model";
import { IDepartmentService } from "src/app/core/services/i.department.service";
import { DEPARTMENT_SERVICE } from "src/app/service/department.service";
import { AppTableComponent } from "../../shared/table/table.component";

@Component({
    templateUrl: "./departments.component.html",
    styleUrls: ["./departments.component.scss"],
})

export class DepartmentsComponent implements OnInit {
    columns: any[];
    items: any[];
    filterFields: any;
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any;
    totalRecords: number;
    form: FormGroup;
    filterForm: FormGroup;
    displayForm: boolean = false;
    selected: boolean;

    @ViewChild(AppTableComponent) table!: AppTableComponent<DepartmentModel>;

    constructor(
        @Inject(DEPARTMENT_SERVICE) protected service: IDepartmentService,
        private fb: FormBuilder) { }

    ngOnInit(): void {

        this.columns = [
            {
                name: 'name',
                label: 'departmentName'
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

        this.createForm();
        this.filterFields = [{ label: 'departmentName', type: 'text', controlName: 'name' },]
    }

    createForm() {
        this.form = this.fb.group({
            id: [0],
            name: ["", [Validators.required]],
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

    handleEdit() {
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

        const data = this.form.value as DepartmentModel;

        if (!this.table.selectedRow)
            await this.service.create(data)
        else
            await this.service.update(data);

        this.toggleForm();

        this.table.refresh();
    }

    updateSearchObject(updatedObject: any) {
        this.searchObject = updatedObject;
    }
}
