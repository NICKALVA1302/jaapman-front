import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnterCategoriesComponent } from './enter-categories.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EnterCategoriesComponent}
    ])],
    exports: [RouterModule]
})
export class EnterCategoriesRoutingModuleModule { }
