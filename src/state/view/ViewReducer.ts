import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './ViewActionTypes';
import * as TabActions from './actions/TabActions';
import { OpenTabAction } from './actions/TabActions';

export interface ViewState {
  currentTab?: string;
}

export const initialViewState: ViewState = {
  currentTab: undefined,
};

type ViewActions = OpenTabAction | any;

function innerViewReducer(draft: Draft<ViewState>, action: ViewActions) {
  switch (action.type) {
    case Type.OPEN_TAB:
      return TabActions.openTab(draft, action.payload);
    default:
      throw new Error('Unknown action type in view reducer.');
  }
}

export const viewReducer: Reducer<any, any> = produce(innerViewReducer);
