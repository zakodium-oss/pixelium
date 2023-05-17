import { Draft } from 'immer';

import { DataState } from '../DataReducer';

export function increment(draft: Draft<DataState>) {
  draft.counter++;
}
