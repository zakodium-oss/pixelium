import { Button, FormGroup, InputGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { BlurOptions, BorderType, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_BLUR } from '../../../../state/data/DataActionTypes';
import PreviewModal from '../PreviewModal';

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

  const [algoError, setAlgoError] = useState<string>();
  const blurredImage = useMemo(() => {
    setAlgoError(undefined);
    if (pipelined instanceof Image) {
      try {
        return pipelined.blur(blurOptions);
      } catch (error: any) {
        setAlgoError(error.message);
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
    () =>
      Object.keys(BorderType).map((borderType) => ({
        label: BorderType[borderType],
        value: BorderType[borderType],
      })),
    [],
  );

  const [borderLabel, setBorderLabel] = useState<string>();

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Blur image"
      viewIdentifier="__blur_preview"
      apply={addBlurFilter}
      original={pipelined}
      preview={blurredImage}
      editing={editing}
      algoError={algoError}
    >
      <FormGroup label="Kernel width">
        <InputGroup
          type="number"
          name="kernelWidth"
          step={2}
          min={1}
          value={blurOptions.width?.toString()}
          onChange={(e) => {
            setBlurOptions({
              ...blurOptions,
              width: e.target.valueAsNumber,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Kernel height">
        <InputGroup
          type="number"
          name="kernelHeight"
          step={2}
          min={1}
          value={blurOptions.height?.toString()}
          onChange={(e) => {
            setBlurOptions({
              ...blurOptions,
              height: e.target.valueAsNumber,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Border type">
        <Select
          filterable={false}
          activeItem={borderTypeOptions.find(
            (option) => option.value === blurOptions.borderType,
          )}
          items={borderTypeOptions}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              key={item.value}
              text={item.label}
              onClick={handleClick}
              active={modifiers.active}
              disabled={modifiers.disabled}
              selected={item.value === blurOptions.borderType}
            />
          )}
          onItemSelect={(item) => {
            setBorderLabel(item.label);
            setBlurOptions({
              ...blurOptions,
              borderType: item.value,
            });
          }}
        >
          <Button
            text={
              borderLabel ??
              borderTypeOptions.find(
                (item) => item.value === blurOptions.borderType,
              )?.label
            }
            rightIcon="double-caret-vertical"
          />
        </Select>
      </FormGroup>
      {blurOptions.borderType === BorderType.CONSTANT && (
        <InputGroup
          type="number"
          name="borderValue"
          value={blurOptions.borderValue?.toString()}
          onChange={(e) => {
            setBlurOptions({
              ...blurOptions,
              borderValue: e.target.valueAsNumber,
            });
          }}
        />
      )}
    </PreviewModal>
  );
}

export default memo(BlurModal);
