import { CurrentUserModel, SupplierCreateModel } from '../domain/models/auth.model';

export interface IAuthService {
    login(credentials: { email: string; password: string }): Promise<void>;
    createSupplier(data: SupplierCreateModel): Promise<void>;
    forgotPassowrd(credentials: { email: string }): Promise<void>;
    resetPassword(credentials: { token: string; newPassword: string }): Promise<void>;
}