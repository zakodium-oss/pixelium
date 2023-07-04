import { v4 as uuid } from '@lukeed/uuid';
import { DilateOptions } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_DILATE = 'SET_DILATE';

export type PipelineSetDilateAction = DataActionType<
  typeof SET_DILATE,
  { identifier: string; opIdentifier?: string; options: DilateOptions }
>;

export type DilateOperation = ExtractOperation<PipelineSetDilateAction>;

export function setDilate(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetDilateAction['payload'],
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
      type: 'DILATE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'DILATE',
      isActive: true,
      options,
    };
  }
}
