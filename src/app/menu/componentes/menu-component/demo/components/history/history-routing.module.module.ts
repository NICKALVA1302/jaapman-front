import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HistoryComponent } from './history.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HistoryComponent}
    ])],
    exports: [RouterModule]
})
export class HistoryRoutingModuleModule { }
