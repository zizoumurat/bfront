// user.service.ts
import { Injectable, InjectionToken } from '@angular/core';
import { IUserService } from '../core/services/i.user.service';
import { UserModel } from '../core/domain/user.model';
import { CurrentUserModel } from '../core/domain/models/auth.model';
import { BaseService } from './base/base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseService<UserModel> implements IUserService {
    constructor(protected override http: HttpClient) {
        super(http, 'users');
    }
    getOwnerList(): Promise<UserModel[]> {
        return firstValueFrom(this.http.get<UserModel[]>(`${BASE_URL}/${this.endPoint}/owner-user-list`));
    }


    override async getAll(): Promise<UserModel[]> {
        return firstValueFrom(this.http.get<UserModel[]>(`${BASE_URL}/${this.endPoint}/all-users`));
    }

    async getCurrentUser(): Promise<CurrentUserModel> {
        return firstValueFrom(this.http.get<CurrentUserModel>(`${BASE_URL}/${this.endPoint}/current-user`));
    }

    async updateCurrentUser(model: CurrentUserModel, userPhoto?: File): Promise<void> {
        const formData = new FormData();
        Object.keys(model).forEach((key) => {
            formData.append(key, model[key]);
        });

        if (userPhoto) {
            formData.append("userPhoto", userPhoto);
        }

        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/update-profile`, formData))
    }

    async changePassowrd(credential: { password: string; newPassword: string; }): Promise<void> {
        const formData = new FormData();
        formData.append('Password', credential.password);
        formData.append('newPassword', credential.newPassword);

        return await firstValueFrom(this.http.put<void>(`${BASE_URL}/${this.endPoint}/change-password`, formData))
    }
}


export const USER_SERVICE = new InjectionToken<IUserService>('UserService');
