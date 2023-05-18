import { Draft } from 'immer';

import { DataActionType } from '../DataActionTypes';
import { DataState } from '../DataReducer';

export type IncrementAction = DataActionType<'INCREMENT'>;

export function increment(draft: Draft<DataState>) {
  draft.counter++;
}
