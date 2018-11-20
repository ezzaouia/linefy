import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { LineRoutingModule } from './line-routing.module';
import { fromComponents } from './components';

@NgModule({
  declarations: [
    ...fromComponents,
  ],
  imports: [
    SharedModule,

    LineRoutingModule,
  ],
})
export class LineModule { }
