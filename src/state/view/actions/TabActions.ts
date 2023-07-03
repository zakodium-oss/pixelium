import { Draft } from 'immer';

import { OPEN_TAB, ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

export type OpenTabAction = ViewActionType<typeof OPEN_TAB, string>;

export function openTab(
  draft: Draft<ViewState>,
  payload: OpenTabAction['payload'],
) {
  draft.currentTab = payload;
}
