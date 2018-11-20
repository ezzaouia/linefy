import { DataUtilActionTypes, DataUtilActionsUnion } from '../actions';

export interface State {
  isLoading: boolean;
  isLoaded: boolean;
  isRunningDataPrep: boolean;
  data: any[];
  data3d: {};
}

const initialState: State = {
  isLoading: false,
  isLoaded: false,
  isRunningDataPrep: false,
  data: null,
  data3d: null,
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
        data: action.payload,
      };
    }
    case DataUtilActionTypes.RunDataPrep: {
      return {
        ...state,
        isRunningDataPrep: true,
      };
    }
    case DataUtilActionTypes.RunDataPrepComplete: {
      return {
        ...state,
        isRunningDataPrep: false,
        data3d: action.payload,
      };
    }
    // TODO Load/Prep Data Failures
    default: {
      return state;
    }
  }
}

export const data = ( state: State ) => state.data;
export const data3d = ( state: State ) => state.data3d;
