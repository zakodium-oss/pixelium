import { FormGroup, RangeSlider } from '@blueprintjs/core';
import { xHistogram, xyToXYObject } from 'ml-spectra-processing';
import { memo, useState, useMemo } from 'react';
import { Plot, BarSeries, Axis } from 'react-plot';

import useROIFilter from '../../hooks/useROIFilter';
import { RoiFilter } from '../context/ROIContext';

const histogramWidth = 250;
const histogramHeight = 120;

function ROIFilter({
  identifier,
  column,
}: {
  identifier: string;
  column: string;
}) {
  const {
    filteredColumn,
    columnFilter,
    minMax,
    stepSize,
    updateMin,
    updateMax,
    removeFilter,
  } = useROIFilter({
    identifier,
    column,
  });

  const sliderValue: [number, number] = [
    columnFilter?.min || minMax.min,
    columnFilter?.max || minMax.max,
  ];

  const [inputMin, setInputMin] = useState<number | ''>(
    columnFilter?.min || minMax.min,
  );
  const [inputMax, setInputMax] = useState<number | ''>(
    columnFilter?.max || minMax.max,
  );

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      {minMax.max - minMax.min > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Histogram values={filteredColumn} columnFilterValue={columnFilter} />

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
              if (value === '') {
                setInputMin('');
              } else {
                updateMin({ column, min: Number(value) });
                setInputMin(Number(value));
              }
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
              if (value === '') {
                setInputMax('');
              } else {
                updateMax({ column, max: Number(value) });
                setInputMax(Number(value));
              }
            }}
            onBlur={() => setInputMax(columnFilter?.max || minMax.max)}
            stepSize={stepSize()}
            placeholder={minMax.max.toString()}
          />
        </FormGroup>
      </div>
      <span
        style={{ color: 'firebrick', cursor: 'pointer' }}
        onClick={() => {
          removeFilter();
          setInputMin(minMax.min);
          setInputMax(minMax.max);
        }}
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
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  return (
    <input
      {...props}
      type="number"
      step={stepSize}
      onChange={(e) => {
        onChange(e.target.value);
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
