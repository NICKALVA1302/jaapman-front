import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsRoutingModule } from './collections-routing.module';
import { CollectionsComponent } from './collections.component';

@NgModule({
    imports: [
        CommonModule,
        CollectionsRoutingModule
    ],
    declarations: [CollectionsComponent]
})
export class CollectionsModule { }
