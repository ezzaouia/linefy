import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Line3dComponent } from './components';

export const lineRoutes: Routes = [
  {
    path: '',
    redirectTo: '3d',
    pathMatch: 'full',
  },
  {
    path: '3d',
    component: Line3dComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forChild( lineRoutes ) ],
  exports: [ RouterModule ],
})
export class LineRoutingModule { }
