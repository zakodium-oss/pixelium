import styled from '@emotion/styled';
import { BitDepth, Image, ImageColorModel } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import {
  REMOVE_OPERATION,
  SET_CONVERT,
} from '../../../../state/data/DataActionTypes';
import { ConvertOptions } from '../../../../state/data/actions/pipeline/filter/convert';
import FastSelector from '../../../FastSelector';
import PreviewModal from '../PreviewModal';

interface ConvertModalProps {
  previewImageIdentifier: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  gap: 50px;
`;

function ConvertModal({ previewImageIdentifier }: ConvertModalProps) {
  const { editing, opIdentifier } = useDefaultOptions(undefined);

  const { pipelined } = useImage(opIdentifier);

  const { defaultOptions } = useDefaultOptions<ConvertOptions>({
    colorModel: pipelined.colorModel,
    bitDepth: pipelined.bitDepth,
  });

  const convertColorOptions: ImageColorModel[] = [
    'GREY',
    'GREYA',
    'RGB',
    'RGBA',
  ];
  const convertDepthOptions = ['8', '16'];

  const [convertOptions, setConvertOptions] = useState<ConvertOptions>({
    colorModel: defaultOptions.colorModel,
    bitDepth: defaultOptions.bitDepth,
  });

  const [convertError, setConvertError] = useState<string>();

  const convertedImage = useMemo(() => {
    setConvertError(undefined);
    if (pipelined instanceof Image) {
      let image = pipelined;
      try {
        if (convertOptions.colorModel !== pipelined.colorModel) {
          image = image.convertColor(convertOptions.colorModel);
        }
        if (convertOptions.bitDepth !== pipelined.bitDepth) {
          image = image.convertBitDepth(convertOptions.bitDepth);
        }
        return image;
      } catch (error: any) {
        setConvertError(error.message);
        return null;
      }
    }
    return null;
  }, [pipelined, convertOptions]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('convert');

  const applyConversion = useCallback(() => {
    if (
      convertOptions?.colorModel === pipelined.colorModel &&
      convertOptions?.bitDepth === pipelined.bitDepth &&
      opIdentifier
    ) {
      dataDispatch({
        type: REMOVE_OPERATION,
        payload: {
          identifier: previewImageIdentifier,
          opIdentifier,
        },
      });
    } else {
      dataDispatch({
        type: SET_CONVERT,
        payload: {
          identifier: previewImageIdentifier,
          opIdentifier,
          options: convertOptions,
        },
      });
    }
    close();
  }, [
    convertOptions,
    pipelined.colorModel,
    pipelined.bitDepth,
    close,
    dataDispatch,
    previewImageIdentifier,
    opIdentifier,
  ]);

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Convert modal"
      viewIdentifier="__convert_preview"
      apply={applyConversion}
      original={pipelined}
      preview={convertedImage}
      editing={editing}
      algoError={convertError}
    >
      <Container>
        <FastSelector
          options={convertColorOptions}
          selected={convertOptions.colorModel}
          setSelected={(convertOpt) => {
            setConvertOptions({
              colorModel: convertOpt,
              bitDepth: convertOptions.bitDepth,
            });
          }}
          defaultItem={pipelined.colorModel}
        />
        <FastSelector
          options={convertDepthOptions}
          selected={convertOptions.bitDepth.toString()}
          setSelected={(convertOpt) => {
            setConvertOptions({
              colorModel: convertOptions.colorModel,
              bitDepth: Number(convertOpt) as BitDepth,
            });
          }}
          defaultItem={pipelined.bitDepth.toString()}
        />
      </Container>
    </PreviewModal>
  );
}

export default memo(ConvertModal);
