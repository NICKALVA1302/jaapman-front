import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnterMaterialsComponent } from './enter-materials.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EnterMaterialsComponent}
    ])],
    exports: [RouterModule]
})
export class EnterMaterialsRoutingModule { }
