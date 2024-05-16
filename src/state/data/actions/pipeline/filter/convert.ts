import { v4 as uuid } from '@lukeed/uuid';
import { BitDepth, ImageColorModel } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_CONVERT = 'SET_CONVERT';

export type ConvertOptions = {
  colorModel: ImageColorModel;
  bitDepth: BitDepth;
};

export type PipelineSetConvertAction = DataActionType<
  typeof SET_CONVERT,
  { identifier: string; opIdentifier?: string; options: ConvertOptions }
>;

export type ConvertOperation = ExtractOperation<PipelineSetConvertAction>;

export function setConvert(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetConvertAction['payload'],
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
      type: 'CONVERT',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'CONVERT',
      isActive: true,
      options,
    };
  }
}
