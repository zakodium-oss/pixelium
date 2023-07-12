import { v4 as uuid } from '@lukeed/uuid';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import RotateOptions from '../../../../../types/RotateOptions';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_ROTATE = 'SET_ROTATE';

export type PipelineSetRotateAction = DataActionType<
  typeof SET_ROTATE,
  { identifier: string; opIdentifier?: string; options: RotateOptions }
>;

export type RotateOperation = ExtractOperation<PipelineSetRotateAction>;

export function setRotate(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetRotateAction['payload'],
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: opIdentifier,
      type: 'ROTATE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'ROTATE',
      isActive: true,
      options,
    };
  }
}
