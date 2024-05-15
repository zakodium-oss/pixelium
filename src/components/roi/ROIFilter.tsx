import { FormGroup, RangeSlider } from '@blueprintjs/core';
import { xHistogram, xyToXYObject } from 'ml-spectra-processing';
import { memo, useState, useMemo, useCallback } from 'react';
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
  const { filteredROIs, minMaxValues } = useROIFilters({
    identifier,
    exclude: column,
  });

  const histValues = filteredROIs.map((roi) => roi[column]);

  const minMax = useMemo(() => {
    return (
      minMaxValues.find((minMaxValue) => minMaxValue.column === column) ?? {
        column,
        min: 0,
        max: 0,
      }
    );
  }, [minMaxValues, column]);

  const columnFilter = filters.find((f) => f.column === column);

  const stepSize = () => {
    let step = 1;
    for (const roi of filteredROIs) {
      if (!Number.isInteger(roi[column])) {
        step = 0.01;
        break;
      }
    }
    return step;
  };

  const sliderValue: [number, number] = [
    columnFilter?.min || minMax.min,
    columnFilter?.max || minMax.max,
  ];

  const [inputMin, setInputMin] = useState(columnFilter?.min);

  const [inputMax, setInputMax] = useState(columnFilter?.max);

  const updateMin = useCallback(
    (newFilter: RoiFilter) => {
      roiDispatch({
        type: 'UPDATE_MIN',
        payload: {
          roiFilter: newFilter,
          min: minMax.min,
          max: minMax.max,
        },
      });
    },
    [minMax, roiDispatch],
  );

  const updateMax = useCallback(
    (newFilter: RoiFilter) => {
      roiDispatch({
        type: 'UPDATE_MAX',
        payload: {
          roiFilter: newFilter,
          min: minMax.min,
          max: minMax.max,
        },
      });
    },
    [minMax, roiDispatch],
  );

  const removeFilter = useCallback(() => {
    roiDispatch({
      type: 'REMOVE_FILTER',
      payload: {
        column,
      },
    });
    setInputMin(minMax.min);
    setInputMax(minMax.max);
  }, [roiDispatch, column, minMax]);

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
              stepSize={stepSize()}
              labelRenderer={false}
              onChange={(value) => {
                updateMin({ column, min: value[0] });
                updateMax({ column, max: value[1] });
                setInputMin(value[0]);
                setInputMax(value[1]);
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
          <Input
            value={inputMin}
            onChange={(value) => {
              updateMin({ column, min: value });
              setInputMin(value);
            }}
            onBlur={() => setInputMin(columnFilter?.min || minMax.min)}
            stepSize={stepSize()}
            placeholder={minMax.min.toString()}
          />
        </FormGroup>
        <FormGroup label="Max">
          <Input
            value={inputMax}
            onChange={(value) => {
              updateMax({ column, max: value });
              setInputMax(value);
            }}
            onBlur={() => setInputMax(columnFilter?.max || minMax.max)}
            stepSize={stepSize()}
            placeholder={minMax.max.toString()}
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
        (point.x > Number(columnFilterValue?.min) ||
          columnFilterValue?.min === undefined) &&
        (point.x < Number(columnFilterValue?.max) ||
          columnFilterValue?.max === undefined),
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

function Input({
  stepSize,
  onChange,
  ...props
}: {
  stepSize: number;
  onChange: (value: number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  return (
    <input
      {...props}
      type="number"
      step={stepSize}
      onChange={(e) => {
        onChange(Number(e.target.value));
      }}
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
