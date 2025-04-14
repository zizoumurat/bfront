import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterSupplierRoutingModule } from './register-supplier-routing.module';
import { RegisterSupplierComponent } from './register-supplier.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from "@ngx-translate/core";
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
    imports: [
        CommonModule,
        RegisterSupplierRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        MultiSelectModule,
        SkeletonModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        DropdownModule,
        TranslateModule,
        InputMaskModule
    ],
    declarations: [RegisterSupplierComponent]
})
export class RegisterSupplierModule { }
