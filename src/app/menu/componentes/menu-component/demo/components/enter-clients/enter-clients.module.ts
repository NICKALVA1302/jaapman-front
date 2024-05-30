import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterClientsRoutingModuleModule } from './enter-clients-routing.module.module';
import { EnterClientsComponent } from './enter-clients.component';

@NgModule({
    imports: [
        CommonModule,
        EnterClientsRoutingModuleModule
    ],
    declarations: [EnterClientsComponent]
})
export class EnterClientsModule { }
