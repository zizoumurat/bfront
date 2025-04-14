import { CurrentUserModel, SupplierCreateModel } from "../../domain/models/auth.model";

export interface IAuthRepository {
    login(credentials: { email: string; password: string }): Promise<any>;
    createSupplier(data: SupplierCreateModel): Promise<void>;
    forgotPassword(credentials: { email: string }): Promise<void>;
    resetPassword(credentials: { token: string, newPassword: string }): Promise<void>;
}