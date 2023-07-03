import { Draft } from 'immer';

import { ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

export type OpenModalAction = ViewActionType<'OPEN_MODAL', string>;
export type CloseModalAction = ViewActionType<'CLOSE_MODAL', string>;
export type SetEditModeIdentifierAction = ViewActionType<
  'SET_EDIT_MODE_IDENTIFIER',
  { identifier: string; opIdentifier: string } | null
>;

export function openModal(
  draft: Draft<ViewState>,
  payload: OpenModalAction['payload'],
) {
  draft.modals[payload] = true;
}
export function closeModal(
  draft: Draft<ViewState>,
  payload: CloseModalAction['payload'],
) {
  draft.modals[payload] = false;
  draft.editMode = null;
}

export function setEditModeIdentifier(
  draft: Draft<ViewState>,
  payload: SetEditModeIdentifierAction['payload'],
) {
  draft.editMode = payload;
}
