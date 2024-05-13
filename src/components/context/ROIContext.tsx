import { Draft, produce } from 'immer';
import { Reducer, createContext, useContext } from 'react';

import { DispatchContext } from './DispatchContext';

export type RoiFilter = {
  column: string;
  min?: number;
  max?: number;
};

export interface ROIState {
  filters: RoiFilter[];
}

export const initialROIState: ROIState = { filters: [] };

export const ROIContext = createContext<ROIState>(initialROIState);

export const ROIProvider = ROIContext.Provider;

export default function useROIContext() {
  return useContext(ROIContext);
}

const UPDATE_FILTER = 'UPDATE_FILTER';
const REMOVE_FILTER = 'REMOVE_FILTER';

export type ROIActions = UpdateFilterAction | RemoveFilterAction;

export type ROIActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export type UpdateFilterAction = ROIActionType<
  typeof UPDATE_FILTER,
  { roiFilter: RoiFilter }
>;

export type RemoveFilterAction = ROIActionType<
  typeof REMOVE_FILTER,
  { column: string }
>;

export function updateFilter(
  draft: Draft<ROIState>,
  payload: UpdateFilterAction['payload'],
) {
  const oldFilters = draft.filters;
  const column = payload.roiFilter.column;

  const oldFilter = oldFilters.find((f) => f.column === column);
  const otherFilters = oldFilters.filter((f) => f.column !== column) ?? [];

  const newFilter = {
    column,
    min: payload.roiFilter.min ?? oldFilter?.min,
    max: payload.roiFilter.max ?? oldFilter?.max,
  };
  draft.filters = [...otherFilters, newFilter];
}

export function removeFilter(
  draft: Draft<ROIState>,
  payload: RemoveFilterAction['payload'],
) {
  draft.filters = draft.filters.filter((f) => f.column !== payload.column);
}

function innerROIReducer(draft: Draft<ROIState>, action: ROIActions) {
  switch (action.type) {
    case UPDATE_FILTER:
      return updateFilter(draft, action.payload);
    case REMOVE_FILTER:
      return removeFilter(draft, action.payload);
    default:
      throw new Error('Unknown action type in roi reducer.');
  }
}
export const ROIReducer: Reducer<ROIState, ROIActions> =
  produce(innerROIReducer);

export function useROIDispatch() {
  return useContext(DispatchContext).roi;
}
