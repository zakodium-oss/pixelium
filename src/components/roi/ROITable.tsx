import { Popover } from '@blueprintjs/core';
import styled from '@emotion/styled';
import {
  ColumnFiltersState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import startCase from 'lodash/startCase';
import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdFilterAlt } from 'react-icons/md';
import { Button } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import usePreferences from '../../hooks/usePreferences';
import useROIs from '../../hooks/useROIs';
import { SET_ROI } from '../../state/data/DataActionTypes';

import ROIFilter from './ROIFilter';

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

interface ROITableProps {
  identifier: string;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setOrgRoisLength: React.Dispatch<React.SetStateAction<number>>;
}

export type RoiDataType = {
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

function ROITable({
  identifier,
  columnFilters,
  setColumnFilters,
  setOrgRoisLength,
}: ROITableProps) {
  const rois = useROIs(identifier);
  const preferences = usePreferences();
  const dataDispatch = useDataDispatch();

  const [sorting, setSorting] = useState<SortingState>([]);

  const [orgRoi] = useState<RoiDataType[]>(
    rois.map((roi) => ({
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
    })),
  );

  useEffect(() => setOrgRoisLength(orgRoi.length), [orgRoi, setOrgRoisLength]);

  const columnHelper = createColumnHelper<RoiDataType>();

  const [keys, setKeys] = useState(preferences.rois.columns);

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

  const table = useReactTable({
    data: orgRoi,
    columns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  // Clear column filters before removing it
  useEffect(() => {
    for (const headerGroup of table.getHeaderGroups()) {
      for (const header of headerGroup.headers) {
        if (
          !preferences.rois.columns.includes(
            header.column.id as keyof RoiDataType,
          )
        ) {
          header.column.setFilterValue([]);
        }
      }
    }
    setKeys(preferences.rois.columns);
  }, [preferences.rois.columns, table]);

  const updateRois = useCallback(() => {
    for (const headerGroup of table.getHeaderGroups()) {
      for (const header of headerGroup.headers) {
        if (header.column.getFilterValue !== undefined) {
          const filteredRois = table.getFilteredRowModel().rows.map((row) => {
            return row.original;
          });
          const newRois = rois.filter((roi) =>
            filteredRois.some((filteredRoi) => filteredRoi.id === roi.id),
          );
          dataDispatch({
            type: SET_ROI,
            payload: {
              identifier,
              rois: newRois,
            },
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDispatch, identifier, table]);

  useEffect(() => {
    updateRois();
  }, [columnFilters, table, updateRois]);

  if (orgRoi.length === 0) {
    return <Empty>No ROIs generated</Empty>;
  }

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
                    style={{
                      borderRight: 'solid 1px lightGray',
                      position: 'sticky',
                      top: 0,
                      backgroundColor: 'white',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                        }}
                      >
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: <FaChevronUp />,
                            desc: <FaChevronDown />,
                          }[header.column.getIsSorted() as string] ?? (
                            <FaChevronDown style={{ visibility: 'hidden' }} />
                          )}
                        </div>
                        <div>
                          {header.column.getCanFilter() ? (
                            <Popover
                              content={
                                <ROIFilter
                                  column={header.column}
                                  table={table}
                                />
                              }
                              placement="bottom"
                            >
                              <Button
                                minimal
                                icon={<MdFilterAlt size={20} />}
                                active={header.column.getIsFiltered()}
                              />
                            </Popover>
                          ) : null}
                        </div>
                      </div>
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

export default memo(ROITable);
