import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterUserRoutingModuleModule } from './enter-user-routing.module.module';
import { EnterUserComponent } from './enter-user.component';

@NgModule({
    imports: [
        CommonModule,
        EnterUserRoutingModuleModule
    ],
    declarations: [EnterUserComponent]
})
export class EnterUserModule { }
