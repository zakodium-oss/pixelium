import { v4 as uuid } from '@lukeed/uuid';
import { ThresholdOptionsAlgorithm } from 'image-js';
import { Draft } from 'immer';

import { DataActionType } from '../../DataActionTypes';
import { DataState } from '../../DataReducer';

export const SET_MASK = 'SET_MASK';

export type PipelineAddMaskAction = DataActionType<
  typeof SET_MASK,
  {
    identifier: string;
    opIdentifier?: string;
    options: ThresholdOptionsAlgorithm;
  }
>;

export function setMask(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineAddMaskAction['payload'],
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
      type: 'MASK',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'MASK',
      isActive: true,
      options,
    };
  }
}
