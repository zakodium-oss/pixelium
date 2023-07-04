import { v4 as uuid } from '@lukeed/uuid';
import { CloseOptions } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_CLOSE = 'SET_CLOSE';

export type PipelineSetCloseAction = DataActionType<
  typeof SET_CLOSE,
  { identifier: string; opIdentifier?: string; options: CloseOptions }
>;

export type CloseOperation = ExtractOperation<PipelineSetCloseAction>;

export function setClose(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetCloseAction['payload'],
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
      type: 'CLOSE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'CLOSE',
      isActive: true,
      options,
    };
  }
}
