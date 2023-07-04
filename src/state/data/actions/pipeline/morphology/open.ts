import { v4 as uuid } from '@lukeed/uuid';
import { OpenOptions } from 'image-js';
import { Draft } from 'immer';

import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_OPEN = 'SET_OPEN';

export type PipelineAddOpenAction = DataActionType<
  typeof SET_OPEN,
  { identifier: string; opIdentifier?: string; options: OpenOptions }
>;

export function setOpen(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineAddOpenAction['payload'],
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
      type: 'OPEN',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'OPEN',
      isActive: true,
      options,
    };
  }
}
