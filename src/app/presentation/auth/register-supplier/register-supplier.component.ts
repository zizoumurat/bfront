import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { SupplierCreateModel } from 'src/app/core/domain/models/auth.model';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { IAuthService } from 'src/app/core/services/i.auth.service';
import { IListItemService } from 'src/app/core/services/i.listItem.service';
import { PasswordValidator } from 'src/app/core/validators/password.validator';
import { LayoutService } from 'src/app/presentation/layout/service/app.layout.service';
import { AUTH_SERVICE } from 'src/app/service/auth.service';
import { LISTITEM_SERVICE } from 'src/app/service/listItem.service';

@Component({
    selector: 'app-login',
    templateUrl: './register-supplier.component.html',
    styleUrl: './register-supplier.component.scss'
})
export class RegisterSupplierComponent {
    imageLoaded: boolean = false;
    taxOfficeOptions = [];
    cityOptions: ListItemModel[];
    districtOptions = [];
    subCategoryOptions = [];
    requestGroupOptions = [];
    registerForm: FormGroup;

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        public layoutService: LayoutService,
        private messageHelper: NotificationHelper,
        public router: Router,
        @Inject(LISTITEM_SERVICE) private service: IListItemService,
        @Inject(AUTH_SERVICE) private authService: IAuthService,
    ) { }

    async ngOnInit() {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            contactFirstName: ['', Validators.required],
            contactLastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(40),
                PasswordValidator.strong,
            ]],
            rePassword: ['', [Validators.required]],
            website: [''],
            phone: [''],
            taxAdministration: ['', Validators.required],
            taxNumber: ['', Validators.required],
            cityId: ['', Validators.required],
            districtId: ['', Validators.required],
            address: ['', Validators.required],
            subCategory: [null, Validators.required],
            requestGroupIdList: [null, Validators.required]
        }, { validator: this.passwordMatchValidator });

        this.getCityList();
        this.getSubCategoryList();
    }

    passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
        const password = group.get('password')?.value;
        const rePassword = group.get('rePassword')?.value;
        return password === rePassword ? null : { 'passwordMismatch': true };
    }


    onImageLoad(): void {
        setTimeout(() => {
            this.imageLoaded = true;
            this.cdr.detectChanges();
        }, 100);
    }

    async getDistrictList(cityId: number) {
        this.districtOptions = await this.service.getPublicSelectedItemList("district", { 'cityId': cityId.toString() });
    }

    async getTaxOfficeList(cityId: number) {
        this.taxOfficeOptions = await this.service.getPublicSelectedItemList("taxOffice", { 'cityId': cityId.toString() });
    }

    async getSubCategoryList() {
        this.subCategoryOptions = await this.service.getPublicSelectedItemList("subCategory");
    }

    async getRequestGroupList(subCategoryId: number) {
        this.registerForm.get('requestGroupIdList').reset();
        this.requestGroupOptions = await this.service.getPublicSelectedItemList("requestGroup", { 'subCategoryId': subCategoryId.toString() });
    }

    async getCityList() {
        this.cityOptions = await this.service.getPublicSelectedItemList("city");
        this.getDistrictList(this.cityOptions[0].id);
        this.getTaxOfficeList(this.cityOptions[0].id);
    }

    cityChange({ value }) {
        this.getDistrictList(value);
        this.getTaxOfficeList(value);
    }

    subCategoryChange({ value }) {
        this.getRequestGroupList(value);
    }

    async onSubmit() {
        if (this.registerForm.valid ) {
            const payload = this.registerForm.value as SupplierCreateModel;

            await this.authService.createSupplier(payload);
            this.messageHelper.showSuccess("Kaydınız başarıyla alınmıştır.Bilgilerinizle giriş yapabilirsiniz.");
            this.router.navigate(["/auth/login"]);
        } else {
            this.registerForm.markAllAsTouched();
            this.messageHelper.showError("Lütfen tüm alanları doğru bir şekilde doldurun")
        }
    }
}
