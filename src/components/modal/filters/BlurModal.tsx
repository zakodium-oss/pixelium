import { BlurOptions, BorderType, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Field, Input, Select } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_BLUR } from '../../../state/data/DataActionTypes';
import FilterModal from '../PreviewModal';

interface BlurModalProps {
  previewImageIdentifier: string;
}

function BlurModal({ previewImageIdentifier }: BlurModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<BlurOptions>({
      width: 1,
      height: 1,
      borderType: BorderType.REFLECT_101,
      borderValue: undefined,
    });

  const { pipelined } = useImage(opIdentifier);

  const [blurOptions, setBlurOptions] = useState<BlurOptions>(defaultOptions);

  const blurredImage = useMemo(() => {
    if (pipelined instanceof Image) {
      try {
        return pipelined.blur(blurOptions);
      } catch {
        return null;
      }
    }

    return null;
  }, [blurOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('blur');

  const addBlurFilter = useCallback(() => {
    dataDispatch({
      type: SET_BLUR,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: blurOptions,
      },
    });
    close();
  }, [blurOptions, close, dataDispatch, opIdentifier, previewImageIdentifier]);

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
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Blur image"
      viewIdentifier="__blur_preview"
      apply={addBlurFilter}
      original={pipelined}
      preview={blurredImage}
      editing={editing}
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
              width: e.target.valueAsNumber,
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
              height: e.target.valueAsNumber,
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
                borderValue: e.target.valueAsNumber,
              });
            }}
          />
        </Field>
      )}
    </FilterModal>
  );
}

export default memo(BlurModal);
