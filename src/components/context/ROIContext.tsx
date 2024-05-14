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

export type ROIActions = UpdateMinAction | UpdateMaxAction | RemoveFilterAction;

export type ROIActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export type UpdateMinAction = ROIActionType<
  'UPDATE_MIN',
  { roiFilter: RoiFilter; max: number }
>;

export type UpdateMaxAction = ROIActionType<
  'UPDATE_MAX',
  { roiFilter: RoiFilter; min: number }
>;

export type RemoveFilterAction = ROIActionType<
  'REMOVE_FILTER',
  { column: string }
>;

export function updateMin(
  draft: Draft<ROIState>,
  payload: UpdateMinAction['payload'],
) {
  const oldFilters = draft.filters;
  const column = payload.roiFilter.column;

  const oldFilter = oldFilters.find((f) => f.column === column);
  const otherFilters = oldFilters.filter((f) => f.column !== column) ?? [];

  const updateValue = payload.roiFilter.min;

  if (
    updateValue !== undefined &&
    updateValue < (oldFilter?.max ?? payload.max)
  ) {
    const newFilter = {
      column,
      min: updateValue,
      max: oldFilter?.max,
    };
    draft.filters = [...otherFilters, newFilter];
  }
}

export function updateMax(
  draft: Draft<ROIState>,
  payload: UpdateMaxAction['payload'],
) {
  const oldFilters = draft.filters;
  const column = payload.roiFilter.column;

  const oldFilter = oldFilters.find((f) => f.column === column);
  const otherFilters = oldFilters.filter((f) => f.column !== column) ?? [];

  const updateValue = payload.roiFilter.max;

  if (
    updateValue !== undefined &&
    updateValue > (oldFilter?.min ?? payload.min)
  ) {
    const newFilter = {
      column,
      min: oldFilter?.min,
      max: updateValue,
    };
    draft.filters = [...otherFilters, newFilter];
  }
}

export function removeFilter(
  draft: Draft<ROIState>,
  payload: RemoveFilterAction['payload'],
) {
  draft.filters = draft.filters.filter((f) => f.column !== payload.column);
}

function innerROIReducer(draft: Draft<ROIState>, action: ROIActions) {
  switch (action.type) {
    case 'UPDATE_MIN':
      return updateMin(draft, action.payload);
    case 'UPDATE_MAX':
      return updateMax(draft, action.payload);
    case 'REMOVE_FILTER':
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
