import styled from '@emotion/styled';
import {
  Column,
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import startCase from 'lodash/startCase';
import { memo, useState, useEffect, useMemo } from 'react';

import usePreferences from '../../hooks/usePreferences';
import useROIs from '../../hooks/useROIs';

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

interface ROITableProps {
  identifier: string;
}

type RoiDataType = {
  id: number;
  column: number;
  row: number;
  width: number;
  height: number;
  surface: number;
  feretMinDiameter: number;
  feretMaxDiameter: number;
  feretAspectRatio: number;
  roundness: number;
  solidity: number;
  sphericity: number;
  fillRatio: number;
};

function ROITable({ identifier }: ROITableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const rois = useROIs(identifier);

  const preferences = usePreferences();

  const roiData: RoiDataType[] = rois.map((roi) => ({
    id: roi.id,
    column: roi.origin.column,
    row: roi.origin.row,
    width: roi.width,
    height: roi.height,
    surface: roi.surface,
    feretMinDiameter: Number(roi.feret.minDiameter.length.toFixed(2)),
    feretMaxDiameter: Number(roi.feret.maxDiameter.length.toFixed(2)),
    feretAspectRatio: Number(roi.feret.aspectRatio.toFixed(2)),
    roundness: Number(roi.roundness.toFixed(2)),
    solidity: Number(roi.solidity.toFixed(2)),
    sphericity: Number(roi.sphericity.toFixed(2)),
    fillRatio: Number(roi.fillRatio.toFixed(2)),
  }));

  const columnHelper = createColumnHelper<RoiDataType>();

  const keys = useMemo(
    () => preferences.rois.columns,
    [preferences.rois.columns],
  );

  const columns = useMemo(
    () =>
      keys.map((key) => {
        return columnHelper.accessor(key, {
          header: startCase(key),
          footer: (props) => props.column.id,
        });
      }),
    [columnHelper, keys],
  );

  const [data] = useState<RoiDataType[]>(roiData);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  if (rois.length === 0) return <Empty>No ROIs generated</Empty>;

  return (
    <div
      style={{
        overflowY: 'auto',
      }}
    >
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ borderRight: 'solid 1px lightGray' }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{ borderRight: 'solid 1px lightGray' }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  const [min, max] = column.getFacetedMinMaxValues() as [number, number];

  return (
    <div>
      <DebouncedInput
        type="number"
        min={min ?? ''}
        max={max ?? ''}
        value={Number((columnFilterValue as [number, number])?.[0]) || ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min (${min ?? ''})`}
      />
      <DebouncedInput
        type="number"
        min={min ?? ''}
        max={max ?? ''}
        value={Number((columnFilterValue as [number, number])?.[1]) || ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max (${max ?? ''})`}
      />
    </div>
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
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value as number}
      onChange={(e) => setValue(e.target.value)}
      style={{
        fontSize: 12,
        border: 'solid 1px lightGray',
        padding: 2,
      }}
    />
  );
}

export default memo(ROITable);
