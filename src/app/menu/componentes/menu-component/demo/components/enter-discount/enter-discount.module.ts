import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterDiscountRoutingModule } from './enter-discount-routing.module';
import { EnterDiscountComponent } from './enter-discount.component';

@NgModule({
    imports: [
        CommonModule,
        EnterDiscountRoutingModule
    ],
    declarations: [EnterDiscountComponent]
})
export class EnterDiscountModule { }
