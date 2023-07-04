import { v4 as uuid } from '@lukeed/uuid';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_INVERT = 'SET_INVERT';

export type PipelineSetInvertAction = DataActionType<
  typeof SET_INVERT,
  { identifier: string; opIdentifier?: string }
>;

export type InvertOperation = ExtractOperation<PipelineSetInvertAction>;

export function setInvert(
  draft: Draft<DataState>,
  { identifier, opIdentifier = uuid() }: PipelineSetInvertAction['payload'],
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
      type: 'INVERT',
      isActive: true,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'INVERT',
      isActive: true,
    };
  }
}
