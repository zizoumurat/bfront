import { CurrentUserModel } from '../domain/models/auth.model';
import { UserModel } from '../domain/user.model';
import { IGenericService } from './generic/i.generic.service';

export interface IUserService extends IGenericService<UserModel>{
    getAll(): Promise<UserModel[]>;
    getOwnerList(): Promise<UserModel[]>;
    getCurrentUser(): Promise<CurrentUserModel>;
    updateCurrentUser(model: CurrentUserModel, userPhoto?: File): Promise<void>;
    changePassowrd(credential: {password: string, newPassword: string}): Promise<void>;
    
}