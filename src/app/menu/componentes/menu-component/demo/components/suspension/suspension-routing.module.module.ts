import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SuspensionComponent } from './suspension.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SuspensionComponent}
    ])],
    exports: [RouterModule]
})
export class SuspensionRoutingModule { }
