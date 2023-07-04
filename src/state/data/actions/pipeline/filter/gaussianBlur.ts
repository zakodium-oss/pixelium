import { v4 as uuid } from '@lukeed/uuid';
import { GaussianBlurXYOptions } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_GAUSSIAN_BLUR = 'SET_GAUSSIAN_BLUR';

export type PipelineSetGaussianBlurAction = DataActionType<
  typeof SET_GAUSSIAN_BLUR,
  { identifier: string; opIdentifier?: string; options: GaussianBlurXYOptions }
>;

export type GaussianBlurOperation =
  ExtractOperation<PipelineSetGaussianBlurAction>;

export function setGaussianBlur(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetGaussianBlurAction['payload'],
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
      type: 'GAUSSIAN_BLUR',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'GAUSSIAN_BLUR',
      isActive: true,
      options,
    };
  }
}
