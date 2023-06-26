import { BorderType, Image, MedianFilterOptions } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Field, Input, Select } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { ADD_MEDIAN_FILTER } from '../../../state/data/DataActionTypes';
import FilterModal from '../FilterModal';

interface MedianFilterModalProps {
  previewImageIdentifier: string;
}

function MedianFilterModal({ previewImageIdentifier }: MedianFilterModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const [medianFilterOptions, setMedianFilterOptions] =
    useState<MedianFilterOptions>({
      cellSize: 1,
      borderType: BorderType.REFLECT_101,
      borderValue: undefined,
    });

  const filteredImage = useMemo(() => {
    if (medianFilterOptions.cellSize % 2 !== 1) {
      return pipelined;
    }

    if (pipelined instanceof Image) {
      return pipelined.medianFilter(medianFilterOptions);
    }

    return pipelined;
  }, [medianFilterOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('median');

  const addMedianFilter = useCallback(() => {
    dataDispatch({
      type: ADD_MEDIAN_FILTER,
      payload: {
        identifier: previewImageIdentifier,
        options: medianFilterOptions,
      },
    });
    close();
  }, [medianFilterOptions, close, dataDispatch, previewImageIdentifier]);

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
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Median filter"
      viewIdentifier="__median_filter_preview"
      apply={addMedianFilter}
      previewed={filteredImage}
    >
      <Field name="cellSize" label="Cell size">
        <Input
          type="number"
          step={2}
          min={1}
          value={medianFilterOptions.cellSize}
          onChange={(e) => {
            setMedianFilterOptions({
              ...medianFilterOptions,
              cellSize: e.target.valueAsNumber,
            });
          }}
        />
      </Field>

      <Field name="borderType" label="Border type">
        <Select
          value={medianFilterOptions.borderType}
          options={borderTypeOptions}
          onSelect={(value) => {
            setMedianFilterOptions({
              ...medianFilterOptions,
              borderType: value as BorderType,
            });
          }}
        />
      </Field>

      {medianFilterOptions.borderType === BorderType.CONSTANT && (
        <Field name="borderValue" label="Border value">
          <Input
            type="number"
            name="borderValue"
            value={medianFilterOptions.borderValue}
            onChange={(e) => {
              setMedianFilterOptions({
                ...medianFilterOptions,
                borderValue: e.target.valueAsNumber,
              });
            }}
          />
        </Field>
      )}
    </FilterModal>
  );
}

export default memo(MedianFilterModal);
