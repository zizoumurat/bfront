import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CompanyModel } from "src/app/core/domain/company.model";
import { ListItemModel } from "src/app/core/domain/listItem.model";
import { ICompanyService } from "src/app/core/services/i.company.service";
import { IListItemService } from "src/app/core/services/i.listItem.service";
import { COMPANY_SERVICE } from "src/app/service/company.service";
import { LISTITEM_SERVICE } from "src/app/service/listItem.service";

@Component({
    selector: "app-company-info",
    templateUrl: "./company-info.component.html",
    styleUrls: ["./company-info.component.scss"],
})

export class CompanyInfoComponent implements OnInit {

    imageUrl: string | ArrayBuffer | '';
    selectedFile: File | null = null;
    company: CompanyModel;
    companyForm: FormGroup;
    cityList: ListItemModel[];
    districtList: ListItemModel[];
    taxOfficeList: ListItemModel[];

    constructor(
        @Inject(COMPANY_SERVICE) private service: ICompanyService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef) { }

    async ngOnInit(): Promise<void> {
        this.createCompanyForm();
        await this.getCompany();
        await this.getCityList();
        await this.getDistrictlist(this.company.cityId);
        await this.getTaxOfficeList(this.company.cityId);
    }

    createCompanyForm() {
        this.companyForm = this.fb.group({
            id: [""],
            name: ["", [Validators.required]],
            cityId: ["", Validators.required],
            districtId: ["", Validators.required],
            address: ["", Validators.required],
            phone: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            taxNumber: [""],
            taxAdministration: ["", Validators.required],
        });
    }

    async getCompany() {
        this.company = await this.service.getCurrentCompany();
        if (this.company.logoUrl)
            this.convertToBase64(this.company.logoUrl);

        this.companyForm.patchValue(this.company);
    }

    async getCityList() {
        this.cityList = await this.listService.getSelectedItemList("city");
    }

    async getDistrictlist(cityId: number) {
        this.districtList = await this.listService.getSelectedItemList("district", { 'cityId': cityId.toString() });
    }

    async getTaxOfficeList(cityId: number) {
        this.taxOfficeList = await this.listService.getSelectedItemList("taxOffice", { 'cityId': cityId.toString() });
    }

    cityChange({ value }) {
        this.getDistrictlist(value);
        this.getTaxOfficeList(value);
    }

    convertToBase64(url: string): void {
        this.imageUrl = `data:image/jpeg;base64,${url}`;
    }

    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.imageUrl = reader.result;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    async onSubmit() {
        if (!this.companyForm.valid)
            return;

        const data = this.companyForm.value as CompanyModel;
        await this.service.update(data, this.selectedFile);
    }
}
