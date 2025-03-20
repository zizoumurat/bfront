import { Injectable, InjectionToken } from '@angular/core';
import { IAuthService } from '../core/services/i.auth.service';
import { SupplierCreateModel } from '../core/domain/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthHelper } from '../core/helpers/auth/auth.helper';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements IAuthService {

    private endPoint = 'auth';

    constructor(protected http: HttpClient, private authHelper: AuthHelper, private router: Router, private userUservice: UserService) {
    }

    forgotPassowrd(credentials: { email: string; }): Promise<void> {
        return firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/forgot-password`, credentials));
    }

    createSupplier(data: SupplierCreateModel): Promise<void> {
        return firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/create-supplier`, data));
    }

    async login(credentials: { email: string; password: string; }): Promise<void> {
        const result = await firstValueFrom(this.http.post<any>(`${BASE_URL}/${this.endPoint}/login`, credentials));
        this.authHelper.setToken(result);

        setTimeout(async () => {
            const currentUser = await this.userUservice.getCurrentUser();
            this.authHelper.setCurrentUser(currentUser);
            this.router.navigate(['/home']);
        }, 500);
    }

    resetPassword(credentials: { token: string; newPassword: string }): Promise<void> {
        return firstValueFrom(this.http.post<void>(`${BASE_URL}/${this.endPoint}/reset-password`, credentials));
    }
}

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AuthService');
