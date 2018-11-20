import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppStoreModule } from './store';
import { SharedModule } from './shared';
import { AppRoutingModule } from './app-routing.module';

import { RootComponent } from './shared/components';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AppStoreModule,
    SharedModule,

    AppRoutingModule,
  ],
  exports: [],
  bootstrap: [ RootComponent ],
})
export class AppModule { }
