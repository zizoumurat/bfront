import { AbstractControl } from '@angular/forms';

export class PasswordValidator {
    static strong(control: AbstractControl): { weakPassword: boolean } | null {
        const value = control.value || '';
        // Güçlü şifre doğrulama mantığını burada tanımlayabilirsiniz.
        const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return strongPattern.test(value) ? null : { weakPassword: true };
    }
}