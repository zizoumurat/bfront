import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MessageModule } from 'primeng/message';
import { SharedModule } from '../../shared/shared.module';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        SkeletonModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        DialogModule,
        TranslateModule,
        MessageModule,
        ProgressBarModule,
        SharedModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule { }
