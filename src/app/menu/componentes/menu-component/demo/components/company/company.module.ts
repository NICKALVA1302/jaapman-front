import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModuleModule } from './company-routing.module.module';
import { CompanyComponent } from './company.component';

@NgModule({
    imports: [
        CommonModule,
        CompanyRoutingModuleModule
    ],
    declarations: [CompanyComponent]
})
export class CompanyModule { }
