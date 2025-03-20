import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuItem, LazyLoadEvent } from "primeng/api";
import { LocationModel } from "src/app/core/domain/location.model";
import { ILocationService } from "src/app/core/services/i.location.service";
import { LOCATION_SERVICE } from "src/app/service/location.service";
import { AppTableComponent } from "../../shared/table/table.component";
import { ListItemModel } from "src/app/core/domain/listItem.model";
import { IListItemService } from "src/app/core/services/i.listItem.service";
import { LISTITEM_SERVICE } from "src/app/service/listItem.service";

@Component({
    templateUrl: "./locations.component.html",
    styleUrls: ["./locations.component.scss"],
})

export class LocationsComponent implements OnInit {
    columns: any[];
    items: any[];
    actionItems: MenuItem[];
    lastLazyLoadEvent: LazyLoadEvent | undefined;
    searchObject: any;
    totalRecords: number;
    form: FormGroup;
    displayForm: boolean = false;
    selected: boolean;

    cityList: ListItemModel[];
    districtList: ListItemModel[];
    filterDistrictList: ListItemModel[];

    filterFields: any;

    @ViewChild(AppTableComponent) table!: AppTableComponent<LocationModel>;

    constructor(
        @Inject(LOCATION_SERVICE) protected service: ILocationService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        private fb: FormBuilder) { }

    async ngOnInit(): Promise<void> {

        this.columns = [
            {
                name: 'name',
                label: 'locationName'
            },
            {
                name: "address",
                label: "locationAddress",
            },
            {
                name: "cityName",
                label: "city",
            },
            {
                name: "districtName",
                label: "district",
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
        this.getCityList();

        this.filterFields = [
            { label: 'locationName', type: 'text', controlName: 'name' },
            { label: 'locationAddress', type: 'text', controlName: 'address' },
            { label: 'city', type: 'select', controlName: 'cityId', relation: 'districtId' },
            { label: 'district', type: 'select', controlName: 'districtId' }
        ];
    }

    createForm() {
        this.form = this.fb.group({
            id: [0],
            name: ["", [Validators.required]],
            address: ["", [Validators.required]],
            cityId: ["", [Validators.required]],
            districtId: ["", [Validators.required]],
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

    async handleEdit() {
        this.selected = true;
        await this.getDistrictlist(this.table.selectedRow.cityId)
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

        const data = this.form.value as LocationModel;

        if (!this.table.selectedRow)
            await this.service.create(data)
        else
            await this.service.update(data);

        this.toggleForm();

        this.table.refresh();
    }

    async getCityList() {
        this.cityList = await this.listService.getSelectedItemList("city");

        const field = this.filterFields.find(field => field.controlName === 'cityId');

        if (field) {
            field.options = this.cityList;
        }
    }

    async getDistrictlist(cityId: number) {
        this.districtList = await this.listService.getSelectedItemList("district", { 'cityId': cityId.toString() });
    }

    async getFilterDistrictlist(cityId: number) {
        this.filterDistrictList = await this.listService.getSelectedItemList("district", { 'cityId': cityId.toString() });

        const field = this.filterFields.find(field => field.controlName === 'districtId');

        if (field) {
            field.options = this.filterDistrictList;
        }
    }

    cityChange({ value }) {
        this.getDistrictlist(value);
    }

    filterCityChange(value) {
        this.getFilterDistrictlist(value);
    }

    onSelectChange(event: { controlName: string; value: any }) {
        if (event.controlName === 'cityId') {
            this.filterCityChange(event.value);
        }
    }

    updateSearchObject(updatedObject: any) {
        this.searchObject = updatedObject;
    }
}
