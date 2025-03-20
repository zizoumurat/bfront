import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterSupplierComponent } from './register-supplier.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RegisterSupplierComponent }
    ])],
    exports: [RouterModule]
})
export class RegisterSupplierRoutingModule { }
