import { BankInfoModel } from '../domain/bankInfo.model';
import { IGenericService } from './generic/i.generic.service';

export interface IBankInfoService extends IGenericService<BankInfoModel> {}