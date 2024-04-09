import { Image, ImageColorModel } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_CONVERT_COLOR } from '../../../../state/data/DataActionTypes';
import FastSelector from '../../../FastSelector';
import PreviewModal from '../PreviewModal';

interface ConvertColorModalProps {
  previewImageIdentifier: string;
}

function ConvertColorModal({ previewImageIdentifier }: ConvertColorModalProps) {
  const { editing, opIdentifier } = useDefaultOptions<undefined>(undefined);

  const { pipelined } = useImage(opIdentifier);

  const newConvertOptions = useMemo(() => {
    const canConvert = new Map<ImageColorModel, ImageColorModel[]>([
      ['GREY', ['GREYA', 'RGB', 'RGBA']],
      ['GREYA', ['GREY', 'RGB', 'RGBA']],
      ['RGB', ['GREY', 'GREYA', 'RGBA']],
      ['RGBA', ['GREY', 'GREYA', 'RGB']],
      ['BINARY', ['GREY', 'RGB', 'RGBA']],
    ]);
    return canConvert.get(pipelined.colorModel);
  }, [pipelined]);

  const defaultOptions: ImageColorModel = newConvertOptions?.[0] || 'GREY';

  const [convertOptions, setConvertOptions] =
    useState<ImageColorModel>(defaultOptions);

  const [convertError, setConvertError] = useState<string>();

  const convertedImage = useMemo(() => {
    setConvertError(undefined);
    if (pipelined instanceof Image) {
      try {
        return pipelined.convertColor(convertOptions);
      } catch (error: any) {
        setConvertError(error.message);
        return null;
      }
    }
    return null;
  }, [pipelined, convertOptions]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('convertColor');

  const applyConversion = useCallback(() => {
    dataDispatch({
      type: SET_CONVERT_COLOR,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: convertOptions,
      },
    });
    close();
  }, [
    close,
    convertOptions,
    dataDispatch,
    opIdentifier,
    previewImageIdentifier,
  ]);

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Convert color modal"
      viewIdentifier="__convert_color_preview"
      apply={applyConversion}
      original={pipelined}
      preview={convertedImage}
      editing={editing}
      algoError={convertError}
    >
      <FastSelector
        options={newConvertOptions || []}
        selected={convertOptions}
        setSelected={(convertOpt) => setConvertOptions(convertOpt)}
      />
    </PreviewModal>
  );
}

export default memo(ConvertColorModal);
