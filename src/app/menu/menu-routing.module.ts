import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuComponentComponent } from '../menu/componentes/menu-component/menu-component.component';
import { AuthGuard } from '../utils/auth.guard';
import { MenuOperadorComponentComponent } from './componentes/menu-operador-component/menu-operador-component.component';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './componentes/menu-component/layout/app.layout.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'usuario', component: AppLayoutComponent , canActivate: [AuthGuard]},
      { path: 'operador', component: MenuOperadorComponentComponent, canActivate: [AuthGuard]},
    ]
  },
];
  const childRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./componentes/menu-component/demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'history', loadChildren: () => import('./componentes/menu-component/demo/components/history/history.module').then(m => m.HistoryModule) },
      { path: 'company', loadChildren: () => import('./componentes/menu-component/demo/components/company/company.module').then(m => m.CompanyModule) },

      { path: 'enter-user', loadChildren: () => import('./componentes/menu-component/demo/components/enter-user/enter-user.module').then(m => m.EnterUserModule) },
      { path: 'enter-materials', loadChildren: () => import('./componentes/menu-component/demo/components/enter-materials/enter-materials.module').then(m => m.EnterMaterialsModule) },
      { path: 'enter-clients', loadChildren: () => import('./componentes/menu-component/demo/components/enter-clients/enter-clients.module').then(m => m.EnterClientsModule) },
      { path: 'enter-categories', loadChildren: () => import('./componentes/menu-component/demo/components/enter-categories/enter-categories.module').then(m => m.EnterCategoriesModule) },
      { path: 'enter-discount', loadChildren: () => import('./componentes/menu-component/demo/components/enter-discount/enter-discount.module').then(m => m.EnterDiscountModule) },

      { path: 'collections', loadChildren: () => import('./componentes/menu-component/demo/components/collections/collections.module').then(m => m.CollectionsModule) },
      { path: 'suspension', loadChildren: () => import('./componentes/menu-component/demo/components/suspension/suspension.module').then(m => m.SuspensionModule) },

      { path: 'sending-receipts', loadChildren: () => import('./componentes/menu-component/demo/components/sending-receipts/sending-receipts.module').then(m => m.SendingReceiptsModule) },
      { path: 'sending-mails', loadChildren: () => import('./componentes/menu-component/demo/components/sending-mails/sending-mails.module').then(m => m.SendingMailsModule) },
      { path: 'setting', loadChildren: () => import('./componentes/menu-component/demo/components/setting/setting.module').then(m => m.SettingModule) },

      { path: 'pages', loadChildren: () => import('./componentes/menu-component/demo/components/pages/pages.module').then(m => m.PagesModule) },

      { path: 'documentation', loadChildren: () => import('./componentes/menu-component/demo/components/documentation/documentation.module').then(m => m.DocumentationModule) }
    ]
    
  }, {
    path: '**',
    redirectTo: 'dashboard' 
  }
  
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RouterModule.forChild(childRoutes),
  ],
  exports:[
    RouterModule
  ]
})
export class MenuRoutingModule { }
