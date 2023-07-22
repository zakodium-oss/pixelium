import { Draft } from 'immer';

import { CLOSE_TAB, OPEN_TAB, ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

export type OpenTabAction = ViewActionType<typeof OPEN_TAB, string>;
export type CloseTabAction = ViewActionType<typeof CLOSE_TAB>;

export function openTab(
  draft: Draft<ViewState>,
  payload: OpenTabAction['payload'],
) {
  draft.currentTab = payload;
}

export function closeTab(draft: Draft<ViewState>) {
  draft.currentTab = undefined;
}
