import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';

import { RootComponent } from './shared/components';

export const AppRoutes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: 'line',
        loadChildren: './line/line.module#LineModule',
      },
      {
        path: '',
        redirectTo: 'line',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    component: RootComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot( AppRoutes, {
      useHash: true,
      enableTracing: environment.production ? false : true,
    }),
  ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }
