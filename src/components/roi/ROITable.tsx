import { Button, Popover } from '@blueprintjs/core';
import styled from '@emotion/styled';
import startCase from 'lodash/startCase';
import { memo } from 'react';
import { MdFilterAlt, MdSearch } from 'react-icons/md';
import { useActions } from 'react-roi';
import { Table, ValueRenderers } from 'react-science/ui';

import useFilteredROIs from '../../hooks/useFilteredROIs';
import usePreferences from '../../hooks/usePreferences';
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
  const { zoomIntoROI } = useActions();
  const rois = useROIs(identifier);
  const { filters } = useROIContext();
  const filteredROIs = useFilteredROIs(identifier);

  function hasFilter(column: string) {
    return filters.some((f) => f.column === column);
  }

  const preferences = usePreferences();

  const columns = preferences.rois.columns;

  if (rois.length === 0) return <Empty>No ROIs generated</Empty>;

  return (
    <div
      style={{
        overflowY: 'auto',
      }}
    >
      <Table compact striped>
        <Table.Header>
          <ValueRenderers.Header />
          {columns.map((column) => (
            <ValueRenderers.Component
              key={column}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 5,
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
                  style={{ padding: 0 }}
                />
              </Popover>
            </ValueRenderers.Component>
          ))}
        </Table.Header>
        {filteredROIs.map((roi) => (
          <Table.Row key={roi.id}>
            <ValueRenderers.Component style={{ marginTop: -2 }}>
              <Button
                minimal
                onClick={() => {
                  zoomIntoROI(
                    [
                      { x: roi.column, y: roi.row },
                      { x: roi.column + roi.width, y: roi.row + roi.height },
                    ],
                    { margin: 0.5 },
                  );
                }}
                style={{ padding: 0 }}
              >
                <MdSearch size={20} />
              </Button>
            </ValueRenderers.Component>
            {columns.map((column) => (
              <ValueRenderers.Number
                key={column}
                value={Number(roi[column]?.toFixed(2))}
              />
            ))}
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}

export default memo(ROITable);
