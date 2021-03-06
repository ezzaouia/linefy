import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromStore from './store';

import { fromServices } from './services';
import { fromComponents } from './components';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,

    StoreModule.forFeature( 'shared', fromStore.reducers ),
    EffectsModule.forFeature( fromStore.effects ),
  ],
  declarations: [ ...fromComponents ],
  providers: [ ...fromServices ],
  exports: [
    CommonModule,
    HttpClientModule,
    ...fromComponents,
  ],
})
export class SharedModule { }
