import { Draft, produce } from 'immer';
import { Reducer } from 'react';

export interface ViewState {}

export const initialViewState: ViewState = {};

type ViewActions = any;

function innerViewReducer(draft: Draft<ViewState>, action: ViewActions) {
  switch (action.type) {
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const viewReducer: Reducer<any, any> = produce(innerViewReducer);
