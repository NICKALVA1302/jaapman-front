import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterMaterialsRoutingModule } from './enter-materials-routing.module';
import { EnterMaterialsComponent } from './enter-materials.component';

@NgModule({
    imports: [
        CommonModule,
        EnterMaterialsRoutingModule
    ],
    declarations: [EnterMaterialsComponent]
})
export class EnterMaterialsModule { }
