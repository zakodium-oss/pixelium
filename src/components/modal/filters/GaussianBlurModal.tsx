import { GaussianBlurXYOptions, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Field, Input } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { ADD_GAUSSIAN_BLUR } from '../../../state/data/DataActionTypes';
import FilterModal from '../FilterModal';

interface GaussianBlurModalProps {
  previewImageIdentifier: string;
}

function BlurModal({ previewImageIdentifier }: GaussianBlurModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const [gaussianBlurOptions, setGaussianBlurOptions] =
    useState<GaussianBlurXYOptions>({
      sigmaX: 1,
      sigmaY: 1,
      sizeX: 1,
      sizeY: 1,
    });

  const blurredImage = useMemo(() => {
    if (
      (gaussianBlurOptions.sizeX || 1) % 2 !== 1 ||
      (gaussianBlurOptions.sizeY || 1) % 2 !== 1
    ) {
      return pipelined;
    }

    if (pipelined instanceof Image) {
      return pipelined.gaussianBlur(gaussianBlurOptions);
    }

    return pipelined;
  }, [gaussianBlurOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('gaussianBlur');

  const addGaussianBlurFilter = useCallback(() => {
    dataDispatch({
      type: ADD_GAUSSIAN_BLUR,
      payload: {
        identifier: previewImageIdentifier,
        options: gaussianBlurOptions,
      },
    });
    close();
  }, [gaussianBlurOptions, close, dataDispatch, previewImageIdentifier]);

  return (
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Gaussian blur image"
      viewIdentifier="__gaussian_blur_preview"
      apply={addGaussianBlurFilter}
      previewed={blurredImage}
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

export default memo(BlurModal);
