import styled from '@emotion/styled';
import { Roi } from 'image-js';
import startCase from 'lodash/startCase';
import { memo, useCallback, useMemo } from 'react';
import { Table, ValueRenderers } from 'react-science/ui';

import usePreferences from '../../hooks/usePreferences';
import useROIs from '../../hooks/useROIs';
import { RoiColumn } from '../../state/preferences/PreferencesReducer';

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
  const preferences = usePreferences();

  const columns = useMemo(
    () => preferences.rois.columns,
    [preferences.rois.columns],
  );

  const columnRenderer = useCallback((column: RoiColumn, roi: Roi) => {
    const {
      id,
      width,
      height,
      surface,
      feret,
      roundness,
      solidity,
      sphericity,
      fillRatio,
      origin: { column: x, row: y },
    } = roi;
    switch (column) {
      case 'id':
        return <ValueRenderers.Number key={column} value={id} />;
      case 'column':
        return <ValueRenderers.Number key={column} value={x} />;
      case 'row':
        return <ValueRenderers.Number key={column} value={y} />;
      case 'width':
        return <ValueRenderers.Number key={column} value={width} />;
      case 'height':
        return <ValueRenderers.Number key={column} value={height} />;
      case 'surface':
        return <ValueRenderers.Number key={column} value={surface} />;
      case 'feretAspectRatio':
        return (
          <ValueRenderers.Number
            key={column}
            value={feret.aspectRatio}
            fixed={2}
          />
        );
      case 'feretMinDiameter':
        return (
          <ValueRenderers.Number
            key={column}
            value={feret.minDiameter.length}
            fixed={2}
          />
        );
      case 'feretMaxDiameter':
        return (
          <ValueRenderers.Number
            key={column}
            value={feret.maxDiameter.length}
            fixed={2}
          />
        );
      case 'roundness':
        return (
          <ValueRenderers.Number key={column} value={roundness} fixed={2} />
        );
      case 'solidity':
        return (
          <ValueRenderers.Number key={column} value={solidity} fixed={2} />
        );
      case 'sphericity':
        return (
          <ValueRenderers.Number key={column} value={sphericity} fixed={2} />
        );
      case 'fillRatio':
        return (
          <ValueRenderers.Number key={column} value={fillRatio} fixed={2} />
        );
      default:
        throw new Error(`Unknown column`);
    }
  }, []);

  if (rois.length === 0) return <Empty>No ROIs generated</Empty>;

  return (
    <div
      style={{
        overflow: 'auto',
      }}
    >
      <Table>
        <Table.Header>
          {columns.map((column) => (
            <ValueRenderers.Header key={column} value={startCase(column)} />
          ))}
        </Table.Header>
        {rois.map((roi) => (
          <Table.Row key={roi.id}>
            {columns.map((column) => columnRenderer(column, roi))}
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}

export default memo(ROITable);
