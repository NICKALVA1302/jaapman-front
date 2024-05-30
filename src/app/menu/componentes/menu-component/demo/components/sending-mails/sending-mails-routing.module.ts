import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SendingMailsComponent } from './sending-mails.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SendingMailsComponent}
    ])],
    exports: [RouterModule]
})
export class SendingMailsRoutingModule { }
