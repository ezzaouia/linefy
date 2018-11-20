import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { DataUtilService } from '../../services';
import { filename, data3dTypeFn, data3dPrep } from '../../../utils/data-3d.prep';

import {
  LoadData,
  DataUtilActionTypes,
  LoadDataSuccess,
  RunDataPrepComplete,
} from '../actions';


@Injectable()
export class ChartSharedEffects {

  constructor (
    private actions$: Actions,
    private dataService: DataUtilService
  ) { }

  @Effect()
  loadData$: Observable<Action> = this.actions$.pipe(
    ofType<LoadData>( DataUtilActionTypes.LoadData ),
    switchMap(() => {
      return this.dataService.loadCSV$( filename, data3dTypeFn )
                .pipe( map( data => new LoadDataSuccess( data )));
    })
  );

  @Effect()
  runDataPrep$: Observable<Action> = this.actions$.pipe(
    ofType<LoadDataSuccess>( DataUtilActionTypes.LoadDataSuccess ),
    map( action => data3dPrep( action.payload )),
    map( data => new RunDataPrepComplete( data ))
  );

}
