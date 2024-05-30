import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnterClientsComponent } from './enter-clients.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EnterClientsComponent}
    ])],
    exports: [RouterModule]
})
export class EnterClientsRoutingModuleModule { }
