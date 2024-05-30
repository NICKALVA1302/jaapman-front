import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendingMailsRoutingModule } from './sending-mails-routing.module';
import { SendingMailsComponent } from './sending-mails.component';

@NgModule({
    imports: [
        CommonModule,
        SendingMailsRoutingModule
    ],
    declarations: [SendingMailsComponent]
})
export class SendingMailsModule { }
