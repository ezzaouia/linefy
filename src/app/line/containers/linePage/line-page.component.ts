import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import * as fromStore from '../../../shared/store';

import { filename } from '../../../utils/line3d.prep';

@Component({
  selector: 'app-line-page',
  template: `
    <div *ngIf="!line3d">Loading...</div>
    <Line3d
      *ngIf="line3d"
      [data]="line3d">
    </Line3d>
  `,
  styles: [ `` ],
})
export class LinePageComponent implements OnInit {
  line3d: any[];

  constructor ( private store: Store<fromStore.State> ) {}

  ngOnInit (): void {
    this.store.dispatch( new fromStore.LoadData( filename ));

    this.store.pipe( select( fromStore.line3d )).subscribe(( d: any[]) => {
      if ( d ) {
        this.line3d = d;
      }
    });
  }
}
