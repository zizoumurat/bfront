import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthHelper } from 'src/app/core/helpers/auth/auth.helper';
import { IAuthService } from 'src/app/core/services/i.auth.service';
import { PasswordValidator } from 'src/app/core/validators/password.validator';
import { LayoutService } from 'src/app/presentation/layout/service/app.layout.service';
import { AUTH_SERVICE } from 'src/app/service/auth.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
    imageLoaded: boolean = false;

    resetPasswordForm: FormGroup;

    password!: string;
    token!: string;

    constructor(
        @Inject(AUTH_SERVICE) private authService: IAuthService,
        private cdr: ChangeDetectorRef,
        public layoutService: LayoutService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authHelper: AuthHelper, private router: Router) { }

    ngOnInit() {
        this.createForm();

        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
        });
    }

    createForm() {
        const required = Validators.required;

        const control = (validators: any[] = []) =>
            this.fb.nonNullable.control(null, validators);

        this.resetPasswordForm = this.fb.group({
            password: control([required, PasswordValidator.strong]),
            rePassword: control([required]),
        }, {
            validators: this.passwordMatchValidator,
        });
    }


    passwordMatchValidator(formGroup: AbstractControl): { mismatch: boolean } | null {
        const password = formGroup.get('password')?.value;
        const rePassword = formGroup.get('rePassword')?.value;
        return password === rePassword ? null : { mismatch: true };
    }

    async onSubmit(): Promise<void> {
        try {
            const password = this.resetPasswordForm.get('password').value;
            const authResponse = await this.authService.resetPassword({ token: this.token, newPassword: password });
            this.router.navigate(['/home']);
        } catch ({ error }) {
        }
    }

    onImageLoad(): void {
        setTimeout(() => {
            this.imageLoaded = true;
            this.cdr.detectChanges();
        }, 100);
    }
}
