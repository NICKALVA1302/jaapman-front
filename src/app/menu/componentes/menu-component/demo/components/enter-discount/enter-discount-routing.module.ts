import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnterDiscountComponent } from './enter-discount.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EnterDiscountComponent}
    ])],
    exports: [RouterModule]
})
export class EnterDiscountRoutingModule { }
