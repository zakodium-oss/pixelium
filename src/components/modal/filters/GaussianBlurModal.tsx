import { GaussianBlurXYOptions, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Field, Input } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_GAUSSIAN_BLUR } from '../../../state/data/DataActionTypes';
import FilterModal from '../PreviewModal';

interface GaussianBlurModalProps {
  previewImageIdentifier: string;
}

function GaussianBlurModal({ previewImageIdentifier }: GaussianBlurModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<GaussianBlurXYOptions>({
      sigmaX: 1,
      sigmaY: 1,
      sizeX: 1,
      sizeY: 1,
    });

  const { pipelined } = useImage(opIdentifier);

  const [gaussianBlurOptions, setGaussianBlurOptions] =
    useState<GaussianBlurXYOptions>(defaultOptions);

  const blurredImage = useMemo(() => {
    if (pipelined instanceof Image) {
      try {
        return pipelined.gaussianBlur(gaussianBlurOptions);
      } catch {
        return null;
      }
    }

    return null;
  }, [gaussianBlurOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('gaussianBlur');

  const addGaussianBlurFilter = useCallback(() => {
    dataDispatch({
      type: SET_GAUSSIAN_BLUR,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: gaussianBlurOptions,
      },
    });
    close();
  }, [
    dataDispatch,
    previewImageIdentifier,
    opIdentifier,
    gaussianBlurOptions,
    close,
  ]);

  return (
    <FilterModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Gaussian blur image"
      viewIdentifier="__gaussian_blur_preview"
      apply={addGaussianBlurFilter}
      original={pipelined}
      preview={blurredImage}
      editing={editing}
    >
      <Field name="sigmaX" label="Sigma X">
        <Input
          type="number"
          name="sigmaX"
          value={gaussianBlurOptions.sigmaX}
          onChange={(e) => {
            setGaussianBlurOptions({
              ...gaussianBlurOptions,
              sigmaX: e.target.valueAsNumber,
            });
          }}
        />
      </Field>
      <Field name="sigmaY" label="Sigma Y">
        <Input
          type="number"
          name="sigmaY"
          value={gaussianBlurOptions.sigmaY}
          onChange={(e) => {
            setGaussianBlurOptions({
              ...gaussianBlurOptions,
              sigmaY: e.target.valueAsNumber,
            });
          }}
        />
      </Field>
      <Field name="sizeX" label="Size X">
        <Input
          type="number"
          name="sizeX"
          min={1}
          step={2}
          value={gaussianBlurOptions.sizeX}
          onChange={(e) => {
            setGaussianBlurOptions({
              ...gaussianBlurOptions,
              sizeX: e.target.valueAsNumber,
            });
          }}
        />
      </Field>
      <Field name="sizeY" label="Size Y">
        <Input
          type="number"
          name="sizeY"
          min={1}
          step={2}
          value={gaussianBlurOptions.sizeY}
          onChange={(e) => {
            setGaussianBlurOptions({
              ...gaussianBlurOptions,
              sizeY: e.target.valueAsNumber,
            });
          }}
        />
      </Field>
    </FilterModal>
  );
}

export default memo(GaussianBlurModal);
