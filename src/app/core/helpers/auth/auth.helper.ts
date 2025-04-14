import { Injectable } from '@angular/core';
import { CurrentUserModel } from '../../domain/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthHelper {
  private tokenModel: { token: string, refreshToken: string, refreshTokenExpires: Date } | null = null;
  private currentUser: CurrentUserModel | null = null;

  constructor() { }

  setToken(token: string) {
    localStorage.setItem('token', JSON.stringify(token));
  }

  getToken(): string | null {
      this.tokenModel = JSON.parse(localStorage.getItem('token'));

    return this.tokenModel?.token;
  }

  setCurrentUser(user: CurrentUserModel) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): CurrentUserModel {
    if (!this.currentUser)
      this.currentUser = JSON.parse(localStorage.getItem('user')) as CurrentUserModel;

    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasCreateRequest() {
    if (!this.isAuthenticated())
      this.logout();

    return this.currentUser.operationOfRole.includes('requests.creator')
  }

  hasRequestOwner() {
    if (!this.isAuthenticated())
      this.logout();

    return this.currentUser.operationOfRole.includes('requests.owner')
  }

  isAuthorized(operation: string[]) {
    return this.currentUser.operationOfRole.some(x => operation.includes(x))
  }

  logout(): void {
    this.tokenModel = null;
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
