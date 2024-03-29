import { v4 as uuid } from '@lukeed/uuid';
import { PixelateOptions } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_PIXELATE = 'SET_PIXELATE';

export type PipelineSetPixelateAction = DataActionType<
  typeof SET_PIXELATE,
  { identifier: string; opIdentifier?: string; options: PixelateOptions }
>;

export type PixelateOperation = ExtractOperation<PipelineSetPixelateAction>;

export function setPixelate(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetPixelateAction['payload'],
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
      type: 'PIXELATE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'PIXELATE',
      isActive: true,
      options,
    };
  }
}
