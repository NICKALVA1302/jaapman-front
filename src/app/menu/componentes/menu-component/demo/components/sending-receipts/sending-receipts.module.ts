import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendingReceiptsRoutingModule } from './sending-receipts-routing.module';
import { SendingReceiptsComponent } from './sending-receipts.component';

@NgModule({
    imports: [
        CommonModule,
        SendingReceiptsRoutingModule
    ],
    declarations: [SendingReceiptsComponent]
})
export class SendingReceiptsModule { }
