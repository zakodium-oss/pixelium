import { v4 as uuid } from '@lukeed/uuid';
import { LevelOptions } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_LEVEL = 'SET_LEVEL';

export type PipelineSetLevelAction = DataActionType<
  typeof SET_LEVEL,
  { identifier: string; opIdentifier?: string; options: LevelOptions }
>;

export type LevelOperation = ExtractOperation<PipelineSetLevelAction>;

export function setLevel(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetLevelAction['payload'],
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
      type: 'LEVEL',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'LEVEL',
      isActive: true,
      options,
    };
  }
}
