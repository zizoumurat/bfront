import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CompanyModel } from "src/app/core/domain/company.model";
import { ListItemModel } from "src/app/core/domain/listItem.model";
import { CurrentUserModel } from "src/app/core/domain/models/auth.model";
import { UserModel } from "src/app/core/domain/user.model";
import { AuthHelper } from "src/app/core/helpers/auth/auth.helper";
import { ICompanyService } from "src/app/core/services/i.company.service";
import { IListItemService } from "src/app/core/services/i.listItem.service";
import { IUserService } from "src/app/core/services/i.user.service";
import { PasswordValidator } from "src/app/core/validators/password.validator";
import { COMPANY_SERVICE } from "src/app/service/company.service";
import { LISTITEM_SERVICE } from "src/app/service/listItem.service";
import { USER_SERVICE } from "src/app/service/user.service";

@Component({
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.scss"],
})

export class UserProfileComponent implements OnInit {

    imageUrl: string | ArrayBuffer | '';
    selectedFile: File | null = null;
    user: CurrentUserModel;
    userForm: FormGroup;
    passwordForm: FormGroup;
    languageOptions: any[];

    constructor(
        @Inject(USER_SERVICE) private service: IUserService,
        @Inject(LISTITEM_SERVICE) private listService: IListItemService,
        private authService: AuthHelper,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef) { }

    async ngOnInit(): Promise<void> {
        this.createUserForm();
        this.createPasswordForm();
        this.languageOptions = [{ name: 'Türkçe', id: 'tr' }, { name: 'İngilizce', id: 'en' }]
        await this.getCurrentUser();
    }

    createUserForm() {
        this.userForm = this.fb.group({
            id: [""],
            name: ["", [Validators.required]],
            surname: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            phoneNumber: ["", Validators.required],
            title: ["", Validators.required],
            choosenLanguage: ["", Validators.required],
        });
    }

    createPasswordForm() {
        const required = Validators.required;

        const control = (validators: any[] = []) =>
            this.fb.nonNullable.control(null, validators);

        this.passwordForm = this.fb.group({
            password: control([required, PasswordValidator.strong]),
            newPassword: control([required, PasswordValidator.strong]),
            reNewPassword: control([required]),
        }, {
            validators: this.passwordMatchValidator,
        });
    }

    passwordMatchValidator(formGroup: AbstractControl): { mismatch: boolean } | null {
        const password = formGroup.get('newPassword')?.value;
        const rePassword = formGroup.get('reNewPassword')?.value;
        return password === rePassword ? null : { mismatch: true };
    }

    async getCurrentUser() {
        this.user = await this.authService.getCurrentUser();
        if (this.user.userPhotoUrl)
            this.convertToBase64(this.user.userPhotoUrl);

        this.userForm.patchValue(this.user);
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
        if (!this.userForm.valid)
            return;

        const data = this.userForm.value as CurrentUserModel;
        await this.service.updateCurrentUser(data, this.selectedFile);

        const updatedData = await this.service.getCurrentUser();
        this.authService.setCurrentUser(updatedData);
    }

    async onSubmitPassword() {
        if (!this.passwordForm.valid)
            return;

        const data = this.passwordForm.value;
        await this.service.changePassowrd({ password: data.password, newPassword: data.newPassword });

        this.passwordForm.reset();
    }
}
