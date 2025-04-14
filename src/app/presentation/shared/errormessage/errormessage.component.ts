import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-error-message',
    templateUrl: "./errormessage.component.html",
})
export class ErrorMessageComponent {
    @Input() control!: AbstractControl;

    constructor(private translateService: TranslateService) { }

    get errorMessage(): string | null {
        return this.control && this.control.invalid && this.control.touched
            ? this.getErrorMessage()
            : null;
    }

    private getErrorMessage(): string {
        if (this.control.errors) {
            const errorKey = Object.keys(this.control.errors)[0];

            if (errorKey === 'required')
                return this.translateService.instant('required');

            if (errorKey === 'email')
                return this.translateService.instant('invalidEmail');

            if (errorKey === 'minlength')
                return this.translateService.instant('minLengthError', { 0: this.control.errors[errorKey].requiredLength });

            if (errorKey === 'maxlength')
                return this.translateService.instant('maxLengthError', { 0: this.control.errors[errorKey].requiredLength });

            if (errorKey === 'min')
                return this.translateService.instant('invalidMinValue', { 0: this.control.errors[errorKey].min });

            if (errorKey === 'max')
                return this.translateService.instant('invalidMaxValue', { 0: this.control.errors[errorKey].max });

            if (errorKey === 'weakPassword')
                return this.translateService.instant('weakPasswordError');
        }

        return '';
    }
}
