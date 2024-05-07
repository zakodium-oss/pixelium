import { Button, Popover } from '@blueprintjs/core';
import styled from '@emotion/styled';
import startCase from 'lodash/startCase';
import { memo, useCallback, useMemo } from 'react';
import { MdFilterAlt } from 'react-icons/md';
import { Table, ValueRenderers } from 'react-science/ui';

import usePreferences from '../../hooks/usePreferences';
import useROIFilters from '../../hooks/useROIFilters';
import useROIs from '../../hooks/useROIs';
import useROIContext from '../context/ROIContext';

import ROIFilter from './ROIFilter';

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

interface ROITableProps {
  identifier: string;
}

function ROITable({ identifier }: ROITableProps) {
  const rois = useROIs(identifier);
  const { filters } = useROIContext();
  const { filteredROIs } = useROIFilters({ identifier });

  const hasFilter = useCallback(
    (column: string) => {
      const columnFilter = filters.find((f) => f.column === column) ?? {
        column,
        min: '',
        max: '',
      };
      if (!columnFilter) return false;
      return (
        typeof columnFilter.min === 'number' ||
        typeof columnFilter.max === 'number'
      );
    },
    [filters],
  );

  const preferences = usePreferences();

  const columns = useMemo(
    () => preferences.rois.columns,
    [preferences.rois.columns],
  );

  if (rois.length === 0) return <Empty>No ROIs generated</Empty>;

  return (
    <div
      style={{
        overflowY: 'auto',
      }}
    >
      <Table>
        <Table.Header>
          {columns.map((column) => (
            <ValueRenderers.Component
              key={column}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <ValueRenderers.Header key={column} value={startCase(column)} />
              <Popover
                content={<ROIFilter identifier={identifier} column={column} />}
                placement="bottom"
              >
                <Button
                  minimal
                  icon={<MdFilterAlt size={20} />}
                  active={hasFilter(column)}
                />
              </Popover>
            </ValueRenderers.Component>
          ))}
        </Table.Header>
        {filteredROIs.map((roi) => (
          <Table.Row key={roi.id}>
            {columns.map((column) => (
              <ValueRenderers.Number key={column} value={roi[column]} />
            ))}
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}

export default memo(ROITable);
