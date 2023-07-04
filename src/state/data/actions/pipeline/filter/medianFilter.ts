import { v4 as uuid } from '@lukeed/uuid';
import { MedianFilterOptions } from 'image-js';
import { Draft } from 'immer';

import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_MEDIAN_FILTER = 'SET_MEDIAN_FILTER';

export type PipelineAddMedianFilterAction = DataActionType<
  typeof SET_MEDIAN_FILTER,
  { identifier: string; opIdentifier?: string; options: MedianFilterOptions }
>;

export function setMedianFilter(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineAddMedianFilterAction['payload'],
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'MEDIAN_FILTER',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'MEDIAN_FILTER',
      isActive: true,
      options,
    };
  }
}
