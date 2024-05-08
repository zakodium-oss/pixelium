import { FormGroup, RangeSlider } from '@blueprintjs/core';
import { xHistogram, xyToXYObject } from 'ml-spectra-processing';
import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { Plot, BarSeries, Axis } from 'react-plot';

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
  const filteredROIs = useROIFilters({
    identifier,
    exclude: column,
  });

  const histValues = useMemo(() => {
    return filteredROIs.map((roi) => roi[column]);
  }, [filteredROIs, column]);

  const updateFilter = useCallback(
    (newFilter: RoiFilter) => {
      roiDispatch({
        type: 'UPDATE_FILTER',
        payload: {
          roiFilter: newFilter,
        },
      });
    },
    [roiDispatch],
  );

  const minMax = useMemo(() => {
    const values = filteredROIs.map((roi) => roi[column]);
    const min = Number.isFinite(Math.min(...values)) ? Math.min(...values) : 0;
    const max = Number.isFinite(Math.max(...values)) ? Math.max(...values) : 0;
    return { column, min, max };
  }, [filteredROIs, column]);

  const columnFilter = useMemo(() => {
    return (
      filters.find((f) => f.column === column) ?? {
        column,
        min: '',
        max: '',
      }
    );
  }, [filters, column]);

  const stepSize = useMemo(() => {
    return ['id', 'column', 'row', 'width', 'height', 'surface'].includes(
      column,
    )
      ? 1
      : 0.01;
  }, [column]);

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
              value={[
                Math.max(Number(columnFilter.min) || minMax.min, minMax.min),
                Math.min(Number(columnFilter.max) || minMax.max, minMax.max),
              ]}
              stepSize={stepSize}
              labelRenderer={false}
              onChange={(value) => {
                updateFilter({ column, min: value[0], max: value[1] });
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
            value={
              Math.max(Number(columnFilter.min) || minMax.min, minMax.min) ?? ''
            }
            onChange={(value) => {
              updateFilter({ column, min: Number(value) || '' });
            }}
            placeholder="min"
          />
        </FormGroup>
        <FormGroup label="Max">
          <DebouncedInput
            type="number"
            value={
              Math.min(Number(columnFilter.max) || minMax.max, minMax.max) ?? ''
            }
            onChange={(value) => {
              updateFilter({ column, max: Number(value) || '' });
            }}
            placeholder="max"
          />
        </FormGroup>
      </div>
      <div
        style={{ color: 'firebrick', cursor: 'pointer' }}
        onClick={() => updateFilter({ column, min: '', max: '' })}
      >
        Reset filter
      </div>
    </div>
  );
}

function Histogram({
  values,
  columnFilterValue,
}: {
  values: number[];
  columnFilterValue: RoiFilter;
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
        (point.x > Number(columnFilterValue.min) &&
          point.x < Number(columnFilterValue.max)) ||
        columnFilterValue.min === '' ||
        columnFilterValue.max === '',
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
  debounce = 800,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, initialValue, onChange, value]);

  return (
    <input
      {...props}
      value={value as number}
      onChange={(e) => setValue(e.target.value)}
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
