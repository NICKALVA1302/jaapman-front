import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnterUserComponent } from './enter-user.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EnterUserComponent}
    ])],
    exports: [RouterModule]
})
export class EnterUserRoutingModuleModule { }
