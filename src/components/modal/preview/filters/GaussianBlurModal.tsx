import { Button, FormGroup, InputGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { BorderType, GaussianBlurXYOptions, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_GAUSSIAN_BLUR } from '../../../../state/data/DataActionTypes';
import PreviewModal from '../PreviewModal';

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
      borderType: 'reflect',
    });

  const { pipelined } = useImage(opIdentifier);

  const [gaussianBlurOptions, setGaussianBlurOptions] =
    useState<GaussianBlurXYOptions>(defaultOptions);

  const [algoError, setAlgoError] = useState<string>();
  const blurredImage = useMemo(() => {
    setAlgoError(undefined);
    if (pipelined instanceof Image) {
      try {
        return pipelined.gaussianBlur(gaussianBlurOptions);
      } catch (error: any) {
        setAlgoError(error.message);
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
      title="Gaussian blur image"
      viewIdentifier="__gaussian_blur_preview"
      apply={addGaussianBlurFilter}
      original={pipelined}
      preview={blurredImage}
      editing={editing}
      algoError={algoError}
    >
      <FormGroup label="Sigma X">
        <InputGroup
          type="number"
          name="sigmaX"
          value={gaussianBlurOptions.sigmaX?.toString()}
          onChange={(e) => {
            setGaussianBlurOptions({
              ...gaussianBlurOptions,
              sigmaX: e.target.valueAsNumber,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Sigma Y">
        <InputGroup
          type="number"
          name="sigmaY"
          value={gaussianBlurOptions.sigmaY?.toString()}
          onChange={(e) => {
            setGaussianBlurOptions({
              ...gaussianBlurOptions,
              sigmaY: e.target.valueAsNumber,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Size X">
        <InputGroup
          type="number"
          name="sizeX"
          min={1}
          step={2}
          value={gaussianBlurOptions.sizeX?.toString()}
          onChange={(e) => {
            setGaussianBlurOptions({
              ...gaussianBlurOptions,
              sizeX: e.target.valueAsNumber,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Size Y">
        <InputGroup
          type="number"
          name="sizeY"
          min={1}
          step={2}
          value={gaussianBlurOptions.sizeY?.toString()}
          onChange={(e) => {
            setGaussianBlurOptions({
              ...gaussianBlurOptions,
              sizeY: e.target.valueAsNumber,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Border type">
        <Select
          filterable={false}
          activeItem={borderTypeOptions.find(
            (item) => item.value === gaussianBlurOptions.borderType,
          )}
          items={borderTypeOptions}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              key={item.value}
              text={item.label}
              onClick={handleClick}
              active={modifiers.active}
              disabled={modifiers.disabled}
              selected={item.value === gaussianBlurOptions.borderType}
            />
          )}
          onItemSelect={(item) => {
            setBorderLabel(item.label);
            setGaussianBlurOptions({
              ...gaussianBlurOptions,
              borderType: item.value,
            });
          }}
        >
          <Button
            text={
              borderLabel ??
              borderTypeOptions.find(
                (item) => item.value === gaussianBlurOptions.borderType,
              )?.label
            }
            rightIcon="double-caret-vertical"
          />
        </Select>
      </FormGroup>
    </PreviewModal>
  );
}

export default memo(GaussianBlurModal);
