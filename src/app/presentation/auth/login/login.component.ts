import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { IAuthService } from 'src/app/core/services/i.auth.service';
import { LayoutService } from 'src/app/presentation/layout/service/app.layout.service';
import { AUTH_SERVICE } from 'src/app/service/auth.service';
import { LoadingHelper } from 'src/app/core/helpers/loading/loading.helper';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    imageLoaded: boolean = false;
    valCheck: string[] = ['remember'];

    password!: string;
    email!: string;

    forgotPasswordForm: FormGroup
    displayForgotPasswordForm: boolean;
    forgotPasswordErrorMessage: string;
    forgotPasswordMailSended: boolean;

    isLoading!: Observable<boolean>;

    constructor(
        @Inject(AUTH_SERVICE) private authService: IAuthService,
        private cdr: ChangeDetectorRef,
        public layoutService: LayoutService,
        private fb: FormBuilder,
        private loadingHelper: LoadingHelper,
        private authHelper: AuthHelper, private router: Router) { }

    ngOnInit() {
        this.isLoading = this.loadingHelper.isLoading$;
        this.createForgotPasswordForm();
    }

    createForgotPasswordForm() {
        const required = Validators.required;

        const control = (validators: any[] = []) =>
            this.fb.nonNullable.control(null, validators);

        this.forgotPasswordForm = this.fb.group({
            email: control([required, Validators.email])
        });
    }

    async onLogin(): Promise<void> {
        try {
            await this.authService.login({ email: this.email, password: this.password });
        } catch ({ error }) {
        }
    }

    onImageLoad(): void {
        setTimeout(() => {
            this.imageLoaded = true;
            this.cdr.detectChanges();
        }, 100);
    }

    showForgotPasswordForm() {
        this.forgotPasswordForm.reset();
        this.displayForgotPasswordForm = true;
        this.forgotPasswordErrorMessage = "";
    }

    async onForgotPassowrdSubmit() {
        if (this.forgotPasswordForm.invalid)
            return;

        try {
            await this.authService.forgotPassowrd(this.forgotPasswordForm.value);
            this.forgotPasswordForm.reset();
            this.forgotPasswordMailSended = true;
        } catch ({ error }) {
            this.forgotPasswordErrorMessage = error.Message;
        }

        this.cdr.detectChanges();
    }
}
