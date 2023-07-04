import { v4 as uuid } from '@lukeed/uuid';
import { GreyOptions } from 'image-js';
import { Draft } from 'immer';

import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_GREY_FILTER = 'SET_GREY_FILTER';

export type PipelineSetGreyFilterAction = DataActionType<
  typeof SET_GREY_FILTER,
  { identifier: string; opIdentifier?: string; options: GreyOptions }
>;

export function setGreyFilter(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetGreyFilterAction['payload'],
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
      type: 'GREY_FILTER',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'GREY_FILTER',
      isActive: true,
      options,
    };
  }
}
