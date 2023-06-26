import { Draft } from 'immer';

import { ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

export type OpenModalAction = ViewActionType<'OPEN_MODAL', string>;
export type CloseModalAction = ViewActionType<'CLOSE_MODAL', string>;

export function openModal(draft: Draft<ViewState>, payload: string) {
  draft.modals[payload] = true;
}
export function closeModal(draft: Draft<ViewState>, payload: string) {
  draft.modals[payload] = false;
}
