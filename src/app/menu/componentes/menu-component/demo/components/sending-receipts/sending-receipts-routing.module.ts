import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SendingReceiptsComponent } from './sending-receipts.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SendingReceiptsComponent}
    ])],
    exports: [RouterModule]
})
export class SendingReceiptsRoutingModule { }
