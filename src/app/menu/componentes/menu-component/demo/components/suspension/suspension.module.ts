import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuspensionRoutingModule } from './suspension-routing.module.module';
import { SuspensionComponent } from './suspension.component';

@NgModule({
    imports: [
        CommonModule,
        SuspensionRoutingModule
    ],
    declarations: [SuspensionComponent]
})
export class SuspensionModule { }
