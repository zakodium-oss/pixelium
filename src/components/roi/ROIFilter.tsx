import { FormGroup, RangeSlider } from '@blueprintjs/core';
import { xHistogram, xyToXYObject } from 'ml-spectra-processing';
import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { Plot, BarSeries, Axis } from 'react-plot';
import { useDebounce } from 'react-use';

import useROIFilters from '../../hooks/useROIFilters';
import useROIContext, {
  RoiFilter,
  useROIDispatch,
} from '../context/ROIContext';

const histogramWidth = 250;
const histogramHeight = 120;

function ROIFilter({
  identifier,
  column,
}: {
  identifier: string;
  column: string;
}) {
  const roiDispatch = useROIDispatch();

  const { filters } = useROIContext();
  const { filteredROIs, minMaxValues } = useROIFilters({
    identifier,
    exclude: column,
  });

  const histValues = useMemo(() => {
    return filteredROIs.map((roi) => roi[column]);
  }, [filteredROIs, column]);

  const minMax = useMemo(() => {
    return (
      minMaxValues.find((minMaxValue) => minMaxValue.column === column) ?? {
        column,
        min: 0,
        max: 0,
      }
    );
  }, [minMaxValues, column]);

  const updateMin = useCallback(
    (newFilter: RoiFilter) => {
      roiDispatch({
        type: 'UPDATE_MIN',
        payload: {
          roiFilter: newFilter,
          max: minMax.max,
        },
      });
    },
    [minMax.max, roiDispatch],
  );

  const updateMax = useCallback(
    (newFilter: RoiFilter) => {
      roiDispatch({
        type: 'UPDATE_MAX',
        payload: {
          roiFilter: newFilter,
          min: minMax.min,
        },
      });
    },
    [minMax.min, roiDispatch],
  );

  const removeFilter = useCallback(() => {
    roiDispatch({
      type: 'REMOVE_FILTER',
      payload: {
        column,
      },
    });
  }, [roiDispatch, column]);

  const columnFilter = useMemo(() => {
    return filters.find((f) => f.column === column);
  }, [filters, column]);

  const stepSize = useMemo(() => {
    for (const roi of filteredROIs) {
      if (!Number.isInteger(roi[column])) return 0.01;
    }
    return 1;
  }, [column, filteredROIs]);

  const sliderValue: [number, number] = useMemo(() => {
    return [
      Math.max(Number(columnFilter?.min) || minMax.min, minMax.min),
      Math.min(Number(columnFilter?.max) || minMax.max, minMax.max),
    ];
  }, [columnFilter, minMax]);

  const inputMin = useMemo(() => {
    return Math.max(Number(columnFilter?.min) || minMax.min, minMax.min);
  }, [columnFilter, minMax]);

  const inputMax = useMemo(() => {
    return Math.min(Number(columnFilter?.max) || minMax.max, minMax.max);
  }, [columnFilter, minMax]);

  useEffect(() => {
    if (columnFilter?.min === minMax.min && columnFilter?.max === minMax.max) {
      removeFilter();
    }
  }, [columnFilter, minMax, removeFilter]);

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      {Math.abs(minMax.max - minMax.min) > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Histogram values={histValues} columnFilterValue={columnFilter} />

          <div style={{ width: histogramWidth, paddingLeft: 26 }}>
            <RangeSlider
              min={minMax.min}
              max={minMax.max}
              value={sliderValue}
              stepSize={stepSize}
              labelRenderer={false}
              onChange={(value) => {
                updateMin({ column, min: value[0] });
                updateMax({ column, max: value[1] });
              }}
            />
          </div>
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          marginTop: 10,
        }}
      >
        <FormGroup label="Min">
          <DebouncedInput
            type="number"
            value={inputMin}
            onChange={(value) => {
              updateMin({ column, min: value });
            }}
            stepSize={stepSize}
            placeholder="min"
          />
        </FormGroup>
        <FormGroup label="Max">
          <DebouncedInput
            type="number"
            value={inputMax}
            onChange={(value) => {
              updateMax({ column, max: value });
            }}
            stepSize={stepSize}
            placeholder="max"
          />
        </FormGroup>
      </div>
      <span
        style={{ color: 'firebrick', cursor: 'pointer' }}
        onClick={removeFilter}
      >
        Reset filter
      </span>
    </div>
  );
}

function Histogram({
  values,
  columnFilterValue,
}: {
  values: number[];
  columnFilterValue: RoiFilter | undefined;
}) {
  const histogram =
    values.length > 0
      ? xHistogram(values, {
          nbSlots: values.length,
          centerX: false,
        })
      : { x: [], y: [] };

  const histData = xyToXYObject(histogram).map((point) => ({
    x: point.x,
    y: point.y,
  }));

  const activeHistData = useMemo(() => {
    return histData.filter(
      (point) =>
        (point.x > Number(columnFilterValue?.min) &&
          point.x < Number(columnFilterValue?.max)) ||
        columnFilterValue?.min === undefined ||
        columnFilterValue?.max === undefined,
    );
  }, [histData, columnFilterValue]);

  return (
    <Plot width={histogramWidth} height={histogramHeight}>
      <BarSeries data={histData} lineStyle={{ stroke: 'cornflowerblue' }} />
      <BarSeries data={activeHistData} lineStyle={{ stroke: 'orange' }} />
      <Axis min={0} position="left" hiddenLine />
      <Axis position="bottom" hiddenTicks />
    </Plot>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  stepSize,
  debounce = 800,
  ...props
}: {
  value: number;
  onChange: (value: number) => void;
  stepSize: number;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useDebounce(
    () => {
      onChange(value);
    },
    debounce,
    [value],
  );

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      {...props}
      value={value}
      step={stepSize}
      onChange={(e) => setValue(Number(e.target.value))}
      style={{
        fontSize: 12,
        border: 'solid 1px lightGray',
        width: 50,
        padding: 2,
      }}
    />
  );
}

export default memo(ROIFilter);