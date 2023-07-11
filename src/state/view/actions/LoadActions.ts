import { Draft } from 'immer';

import { LOAD_VIEW_STATE, ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

export type LoadViewStateAction = ViewActionType<
  typeof LOAD_VIEW_STATE,
  ViewState
>;

export function loadViewState(
  draft: Draft<ViewState>,
  payload: LoadViewStateAction['payload'],
) {
  draft.modals = payload.modals;
  draft.editMode = payload.editMode;
  draft.imageViewerProps = payload.imageViewerProps;
  draft.editROIPreference = payload.editROIPreference;
  draft.currentTab = payload.currentTab;
}
