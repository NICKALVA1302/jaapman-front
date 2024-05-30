import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollectionsComponent } from './collections.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CollectionsComponent}
    ])],
    exports: [RouterModule]
})
export class CollectionsRoutingModule { }
