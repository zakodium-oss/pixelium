import { v4 as uuid } from '@lukeed/uuid';
import { FlipOptions } from 'image-js';
import { Draft } from 'immer';

import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_FLIP = 'SET_FLIP';

export type PipelineAddFlipAction = DataActionType<
  typeof SET_FLIP,
  { identifier: string; opIdentifier?: string; options: FlipOptions }
>;

export function setFlip(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineAddFlipAction['payload'],
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
      type: 'FLIP',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'FLIP',
      isActive: true,
      options,
    };
  }
}
