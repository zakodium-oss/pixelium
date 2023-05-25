import { Draft } from 'immer';

import { ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

export type SetPanAction = ViewActionType<
  'SET_PAN',
  { identifier: string; x: number; y: number }
>;

export function setPan(
  draft: Draft<ViewState>,
  { identifier, x, y }: { identifier: string; x: number; y: number },
) {
  draft.imageViewerProps.set(identifier, { pan: { x, y } });
}
