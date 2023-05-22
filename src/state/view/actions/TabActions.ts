import { Draft } from 'immer';

import { ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

export type OpenTabAction = ViewActionType<'OPEN_TAB', string>;

export function openTab(draft: Draft<ViewState>, payload: string) {
  draft.currentTab = payload;
}
