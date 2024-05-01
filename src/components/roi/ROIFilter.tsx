import { FormGroup } from '@blueprintjs/core';
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
  const columnFilterValue = column.getFilterValue();

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
      <div style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <Histogram values={histValues} />
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
            value={Number((columnFilterValue as [number, number])?.[0]) || ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                value,
                old?.[1],
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
            value={Number((columnFilterValue as [number, number])?.[1]) || ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                value,
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

function Histogram({ values }: { values: number[] }) {
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

  return (
    <Plot width={200} height={100}>
      <BarSeries data={histData} lineStyle={{ stroke: 'cornflowerblue' }} />
      <Axis min={0} position="left" hidden />
      <Axis position="bottom" paddingEnd="10" paddingStart="10" hiddenTicks />
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
