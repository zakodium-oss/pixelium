import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as IncrementActions from './actions/IncrementActions';
import { INCREMENT } from './actions/Types';

export interface DataState {
  counter: number;
}

export const initialDataState: DataState = {
  counter: 0,
};

function innerDataReducer(draft: Draft<DataState>, action) {
  switch (action.type) {
    case INCREMENT:
      return IncrementActions.increment(draft);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const dataReducer: Reducer<any, any> = produce(innerDataReducer);
