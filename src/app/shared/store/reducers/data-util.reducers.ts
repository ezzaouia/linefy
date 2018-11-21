import { DataUtilActionTypes, DataUtilActionsUnion } from '../actions';

export interface State {
  isLoading: boolean;
  isLoaded: boolean;
  rawdata: any[];
  line3d: {};
}

const initialState: State = {
  isLoading: false,
  isLoaded: false,
  rawdata: null,
  line3d: null,
};

export function reducers (
  state = initialState,
  action: DataUtilActionsUnion
): State {
  switch ( action.type ) {
    case DataUtilActionTypes.LoadData: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case DataUtilActionTypes.LoadDataSuccess: {
      return {
        ...state,
        isLoading: false,
        rawdata: action.payload,
      };
    }
    case DataUtilActionTypes.RunDataPrep: {
      return {
        ...state,
      };
    }
    case DataUtilActionTypes.RunDataPrepComplete: {
      return {
        ...state,
        isLoaded: true,
        line3d: action.payload,
      };
    }
    // TODO Load/Prep Data Failures
    default: {
      return state;
    }
  }
}

export const rawdata = ( state: State ) => state.rawdata;
export const line3d = ( state: State ) => state.line3d;
