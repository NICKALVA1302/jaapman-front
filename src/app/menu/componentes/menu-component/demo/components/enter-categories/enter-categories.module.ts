import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterCategoriesRoutingModuleModule } from './enter-categories-routing.module.module';
import { EnterCategoriesComponent } from './enter-categories.component';

@NgModule({
    imports: [
        CommonModule,
        EnterCategoriesRoutingModuleModule
    ],
    declarations: [EnterCategoriesComponent]
})
export class EnterCategoriesModule { }
