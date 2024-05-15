import { Image, ImageColorModel } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_CONVERT_COLOR } from '../../../../state/data/DataActionTypes';
import { ConvertColorOptions } from '../../../../state/data/actions/pipeline/filter/convertColor';
import FastSelector from '../../../FastSelector';
import PreviewModal from '../PreviewModal';

interface ConvertColorModalProps {
  previewImageIdentifier: string;
}

function ConvertColorModal({ previewImageIdentifier }: ConvertColorModalProps) {
  const { editing, opIdentifier } = useDefaultOptions<undefined>(undefined);

  const { pipelined } = useImage(opIdentifier);

  const convertOptionsList: ImageColorModel[] = [
    'GREY',
    'GREYA',
    'RGB',
    'RGBA',
  ];

  const defaultOptions: ConvertColorOptions = {
    colorModel: pipelined.colorModel,
  };

  const [convertOptions, setConvertOptions] =
    useState<ConvertColorOptions>(defaultOptions);

  const [convertError, setConvertError] = useState<string>();

  const convertedImage = useMemo(() => {
    setConvertError(undefined);
    if (pipelined instanceof Image) {
      try {
        if (convertOptions.colorModel === pipelined.colorModel) {
          return pipelined;
        } else {
          return pipelined.convertColor(convertOptions.colorModel);
        }
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
    if (convertOptions.colorModel !== pipelined.colorModel) {
      dataDispatch({
        type: SET_CONVERT_COLOR,
        payload: {
          identifier: previewImageIdentifier,
          opIdentifier,
          options: convertOptions,
        },
      });
    }
    close();
  }, [
    close,
    convertOptions,
    dataDispatch,
    opIdentifier,
    pipelined.colorModel,
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
        options={convertOptionsList}
        selected={convertOptions.colorModel}
        setSelected={(convertOpt) =>
          setConvertOptions({ colorModel: convertOpt })
        }
        defaultItem={pipelined.colorModel}
      />
    </PreviewModal>
  );
}

export default memo(ConvertColorModal);
