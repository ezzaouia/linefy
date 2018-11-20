import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { csv } from 'd3';

@Injectable()
export class DataUtilService {
  constructor () {}

  loadCSV$ ( string, typeFn? ) {
    return from( csv( string, typeFn ));
  }

  loadCSV ( string, typeFn? ) {
    return csv( string, typeFn );
  }
}
