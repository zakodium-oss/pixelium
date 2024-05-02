import { FormGroup, RangeSlider } from '@blueprintjs/core';
import {
  Column,
  Table,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { xHistogram, xyToXYObject } from 'ml-spectra-processing';
import { memo, useState, useEffect, useMemo } from 'react';
import { Plot, BarSeries, Axis } from 'react-plot';
import { Button } from 'react-science/ui';

import { RoiDataType } from './ROITable';

function ROIFilter({
  column,
  table,
}: {
  column: Column<RoiDataType, unknown>;
  table: Table<RoiDataType>;
}) {
  const columnFilterValue = column.getFilterValue() as [number, number];

  // Create a new table without the current column filter for the histogram
  const histTable = useReactTable({
    data: table.options.data,
    columns: table.options.columns,
    state: {
      columnFilters: table.options.state.columnFilters?.filter(
        (filter) => filter.id !== column.id,
      ),
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const minMaxValues = useMemo(() => {
    for (const headerGroup of histTable.getHeaderGroups()) {
      for (const header of headerGroup.headers) {
        if (header.column.id === column.id) {
          return header.column.getFacetedMinMaxValues() as [number, number];
        }
      }
    }
    return column.getFacetedMinMaxValues() as [number, number];
  }, [column, histTable]);

  const [min, max] = minMaxValues ?? [];

  const histValues = useMemo(
    () =>
      histTable
        .getFilteredRowModel()
        .rows.map((row) => row.original[column.id]),
    [column.id, histTable],
  );

  return (
    <div
      style={{
        padding: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'end',
          gap: 10,
          padding: 10,
        }}
      >
        <Histogram
          values={histValues}
          columnFilterValue={columnFilterValue ?? [min, max]}
        />
        <div style={{ width: '100%', paddingLeft: 18 }}>
          <RangeSlider
            min={min}
            max={max}
            value={columnFilterValue ?? [min, max]}
            stepSize={
              ['id', 'column', 'row', 'width', 'height', 'surface'].includes(
                column.id,
              )
                ? 1
                : 0.01
            }
            labelRenderer={false}
            onChange={(value) => {
              column.setFilterValue(value);
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <FormGroup label="Min">
          <DebouncedInput
            type="number"
            min={min ?? ''}
            max={max ?? ''}
            value={Number(columnFilterValue?.[0]) || ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                Number(value),
                old?.[1] || max,
              ])
            }
            placeholder={`${min ?? ''}`}
          />
        </FormGroup>
        <FormGroup label="Max">
          <DebouncedInput
            type="number"
            min={min ?? ''}
            max={max ?? ''}
            value={Number(columnFilterValue?.[1]) || ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0] || min,
                Number(value),
              ])
            }
            placeholder={`${max ?? ''}`}
          />
        </FormGroup>
      </div>
      <Button minimal intent="danger" onClick={() => column.setFilterValue([])}>
        Reset filter
      </Button>
    </div>
  );
}

function Histogram({
  values,
  columnFilterValue,
}: {
  values: number[];
  columnFilterValue: [number, number];
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
        point.x > columnFilterValue[0] && point.x < columnFilterValue[1],
    );
  }, [histData, columnFilterValue]);

  return (
    <Plot width={200} height={100}>
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
  debounce = 500,
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
        width: '100%',
        padding: 2,
      }}
    />
  );
}

export default memo(ROIFilter);
