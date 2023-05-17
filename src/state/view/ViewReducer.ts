import { Draft, produce } from 'immer';
import { Reducer } from 'react';

export interface ViewState {
  // TODO define data
}

export const initialViewState: ViewState = {};

function innerViewReducer(draft: Draft<ViewState>, action) {
  switch (action.type) {
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const viewReducer: Reducer<any, any> = produce(innerViewReducer);
