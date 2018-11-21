import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { DataUtilService } from '../../services';
import { cast, line3dPrep } from '../../../utils/line3d.prep';

import {
  LoadData,
  DataUtilActionTypes,
  LoadDataSuccess,
  RunDataPrepComplete,
} from '../actions';


@Injectable()
export class DataEffects {

  constructor (
    private actions$: Actions,
    private dataService: DataUtilService
  ) { }

  @Effect()
  loadData$: Observable<Action> = this.actions$.pipe(
    ofType<LoadData>( DataUtilActionTypes.LoadData ),
    switchMap(({ payload }) => {
      return this.dataService.loadCSV$( payload, cast )
                .pipe( map( data => new LoadDataSuccess( data )));
    })
  );

  @Effect()
  runDataPrep$: Observable<Action> = this.actions$.pipe(
    ofType<LoadDataSuccess>( DataUtilActionTypes.LoadDataSuccess ),
    map( action => line3dPrep( action.payload )),
    map( data => new RunDataPrepComplete( data ))
  );

}
