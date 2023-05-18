import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './DataActionTypes';
import * as IncrementActions from './actions/IncrementActions';
import type { IncrementAction } from './actions/IncrementActions';

export interface DataState {
  counter: number;
}

export const initialDataState: DataState = {
  counter: 0,
};

type DataActions = IncrementAction;

function innerDataReducer(draft: Draft<DataState>, action: DataActions) {
  switch (action.type) {
    case Type.INCREMENT:
      return IncrementActions.increment(draft);
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const dataReducer: Reducer<any, any> = produce(innerDataReducer);
