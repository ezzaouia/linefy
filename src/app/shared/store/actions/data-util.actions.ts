import { Action } from '@ngrx/store';

export enum DataUtilActionTypes {
  LoadData = '[Shared] Load Data',
  LoadDataSuccess = '[Shared] Load Data Sucess',
  RunDataPrep = '[Shared] Run Data Prep',
  RunDataPrepComplete = '[Shared] Run Data Prep Complete',
}

export class LoadData implements Action {
  readonly type = DataUtilActionTypes.LoadData;

  constructor ( public payload: string ) { }
}

export class LoadDataSuccess implements Action {
  readonly type = DataUtilActionTypes.LoadDataSuccess;

  constructor ( public payload: any ) { }
}

export class RunDataPrep implements Action {
  readonly type = DataUtilActionTypes.RunDataPrep;
}

export class RunDataPrepComplete implements Action {
  readonly type = DataUtilActionTypes.RunDataPrepComplete;

  constructor ( public payload: any ) { }
}

export type DataUtilActionsUnion = LoadData | LoadDataSuccess | RunDataPrep | RunDataPrepComplete;
