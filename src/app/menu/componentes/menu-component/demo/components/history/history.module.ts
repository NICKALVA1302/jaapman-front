import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryRoutingModuleModule } from './history-routing.module.module';
import { HistoryComponent } from './history.component';

@NgModule({
    imports: [
        CommonModule,
        HistoryRoutingModuleModule
    ],
    declarations: [HistoryComponent]
})
export class HistoryModule { }
