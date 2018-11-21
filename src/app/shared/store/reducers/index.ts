import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import * as fromDataShared from './data-util.reducers';

export interface State {
  data: fromDataShared.State;
}

export const reducers: ActionReducerMap<State> = {
  data: fromDataShared.reducers,
};

const _state = createFeatureSelector<State>( 'shared' );
const _data = createSelector( _state, ( state: State ) => state.data );

export const rawdata = createSelector( _data, fromDataShared.rawdata );
export const line3d = createSelector( _data, fromDataShared.line3d );
