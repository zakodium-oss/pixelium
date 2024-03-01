import { Button, FormGroup, InputGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { BorderType, Image, MedianFilterOptions } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_MEDIAN_FILTER } from '../../../../state/data/DataActionTypes';
import PreviewModal from '../PreviewModal';

interface MedianFilterModalProps {
  previewImageIdentifier: string;
}

function MedianFilterModal({ previewImageIdentifier }: MedianFilterModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<MedianFilterOptions>({
      cellSize: 1,
      borderType: BorderType.REFLECT_101,
      borderValue: undefined,
    });

  const { pipelined } = useImage(opIdentifier);

  const [medianFilterOptions, setMedianFilterOptions] =
    useState<MedianFilterOptions>(defaultOptions);

  const [algoError, setAlgoError] = useState<string>();
  const filteredImage = useMemo(() => {
    setAlgoError(undefined);
    if (pipelined instanceof Image) {
      try {
        return pipelined.medianFilter(medianFilterOptions);
      } catch (error: any) {
        setAlgoError(error.message);
        return null;
      }
    }

    return null;
  }, [medianFilterOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('median');

  const addMedianFilter = useCallback(() => {
    dataDispatch({
      type: SET_MEDIAN_FILTER,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: medianFilterOptions,
      },
    });
    close();
  }, [
    dataDispatch,
    previewImageIdentifier,
    opIdentifier,
    medianFilterOptions,
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
      title="Median filter"
      viewIdentifier="__median_filter_preview"
      apply={addMedianFilter}
      original={pipelined}
      preview={filteredImage}
      editing={editing}
      algoError={algoError}
    >
      <FormGroup label="Cell size">
        <InputGroup
          type="number"
          step={2}
          min={1}
          value={medianFilterOptions.cellSize?.toString()}
          onChange={(e) => {
            setMedianFilterOptions({
              ...medianFilterOptions,
              cellSize: e.target.valueAsNumber,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Border type">
        <Select
          filterable={false}
          activeItem={borderTypeOptions.find(
            (option) => option.value === medianFilterOptions.borderType,
          )}
          items={borderTypeOptions}
          itemRenderer={(option, { handleClick, modifiers }) => (
            <MenuItem
              key={option.value}
              text={option.label}
              onClick={handleClick}
              active={modifiers.active}
              disabled={modifiers.disabled}
              selected={option.value === medianFilterOptions.borderType}
            />
          )}
          onItemSelect={(item) => {
            setBorderLabel(item.label);
            setMedianFilterOptions({
              ...medianFilterOptions,
              borderType: item.value,
            });
          }}
        >
          <Button
            text={
              borderLabel ??
              borderTypeOptions.find(
                (item) => item.value === medianFilterOptions.borderType,
              )?.label
            }
            rightIcon="double-caret-vertical"
          />
        </Select>
      </FormGroup>

      {medianFilterOptions.borderType === BorderType.CONSTANT && (
        <InputGroup
          type="number"
          name="borderValue"
          value={medianFilterOptions.borderValue?.toString()}
          onChange={(e) => {
            setMedianFilterOptions({
              ...medianFilterOptions,
              borderValue: e.target.valueAsNumber,
            });
          }}
        />
      )}
    </PreviewModal>
  );
}

export default memo(MedianFilterModal);
