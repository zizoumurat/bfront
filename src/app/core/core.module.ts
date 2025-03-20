import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth/auth.interceptor';
import { errorInterceptor } from './interceptors/error/error.interceptor';
import { loadingInterceptor } from './interceptors/loading/loading.interceptor';
import { LoadingHelper } from './helpers/loading/loading.helper';
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from 'primeng/api';
import { deleteInterceptor } from './interceptors/delete/delete.interceptor';
import { dateFormatInterceptor } from './interceptors/date/date.interceptor';


@NgModule({
    imports: [
        CommonModule,
        ToastModule,
    ],
    providers: [
        LoadingHelper,
        MessageService,
        ConfirmationService,
        provideHttpClient(
            withInterceptors([authInterceptor, deleteInterceptor, dateFormatInterceptor, loadingInterceptor, errorInterceptor])
        )
    ]
})
export class CoreModule { }