import { NgModule } from '@angular/core';
import { SettingComponent } from './setting.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SettingComponent}
    ])],
    exports: [RouterModule]
})
export class SettingRoutingModule { }
