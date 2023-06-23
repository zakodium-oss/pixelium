import { BlurOptions, BorderType, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Field, Input, Select } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useImage from '../../../hooks/useImage';
import { ADD_BLUR } from '../../../state/data/DataActionTypes';
import FilterModal from '../FilterModal';

interface BlurModalProps {
  isOpenDialog: boolean;
  closeDialog: () => void;
  previewImageIdentifier: string;
}

function BlurModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: BlurModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const [blurOptions, setBlurOptions] = useState<BlurOptions>({
    width: 1,
    height: 1,
    borderType: BorderType.REFLECT_101,
    borderValue: undefined,
  });

  const blurredImage = useMemo(() => {
    if (blurOptions.width % 2 !== 1 || blurOptions.height % 2 !== 1) {
      return pipelined;
    }

    if (pipelined instanceof Image) {
      return pipelined.blur(blurOptions);
    }

    return pipelined;
  }, [blurOptions, pipelined]);

  const dataDispatch = useDataDispatch();

  const addBlurFilter = useCallback(() => {
    dataDispatch({
      type: ADD_BLUR,
      payload: {
        identifier: previewImageIdentifier,
        options: blurOptions,
      },
    });
    closeDialog();
  }, [blurOptions, closeDialog, dataDispatch, previewImageIdentifier]);

  const borderTypeOptions = useMemo(
    () => [
      Object.keys(BorderType).map((borderType) => ({
        label: BorderType[borderType],
        value: BorderType[borderType],
      })),
    ],
    [],
  );

  return (
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={closeDialog}
      isOpenDialog={isOpenDialog}
      title="Blur image"
      viewIdentifier="__blur_preview"
      apply={addBlurFilter}
      previewed={blurredImage}
    >
      <Field name="kernelWidth" label="Kernel width">
        <Input
          type="number"
          name="kernelWidth"
          step={2}
          min={1}
          value={blurOptions.width}
          onChange={(e) => {
            setBlurOptions({
              ...blurOptions,
              width: Number(e.target.value),
            });
          }}
        />
      </Field>
      <Field name="kernelHeight" label="Kenel height">
        <Input
          type="number"
          name="kernelHeight"
          step={2}
          min={1}
          value={blurOptions.height}
          onChange={(e) => {
            setBlurOptions({
              ...blurOptions,
              height: Number(e.target.value),
            });
          }}
        />
      </Field>

      <Field name="borderType" label="Border type">
        <Select
          value={blurOptions.borderType}
          options={borderTypeOptions}
          onSelect={(value) => {
            setBlurOptions({
              ...blurOptions,
              borderType: value as BorderType,
            });
          }}
        />
      </Field>

      {blurOptions.borderType === BorderType.CONSTANT && (
        <Field name="borderValue" label="Border value">
          <Input
            type="number"
            name="borderValue"
            value={blurOptions.borderValue}
            onChange={(e) => {
              setBlurOptions({
                ...blurOptions,
                borderValue: Number(e.target.value),
              });
            }}
          />
        </Field>
      )}
    </FilterModal>
  );
}

export default memo(BlurModal);
