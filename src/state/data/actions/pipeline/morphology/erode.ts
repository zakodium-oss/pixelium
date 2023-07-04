import { v4 as uuid } from '@lukeed/uuid';
import { ErodeOptions } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_ERODE = 'SET_ERODE';

export type PipelineSetErodeAction = DataActionType<
  typeof SET_ERODE,
  { identifier: string; opIdentifier?: string; options: ErodeOptions }
>;

export type ErodeOperation = ExtractOperation<PipelineSetErodeAction>;

export function setErode(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetErodeAction['payload'],
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
      type: 'ERODE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'ERODE',
      isActive: true,
      options,
    };
  }
}
