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
          <ValueRenderers.Text
            key={column}
            value={feret.aspectRatio.toFixed(2)}
          />
        );
      case 'feretMinDiameter':
        return (
          <ValueRenderers.Text
            key={column}
            value={feret.minDiameter.length.toFixed(2)}
          />
        );
      case 'feretMaxDiameter':
        return (
          <ValueRenderers.Text
            key={column}
            value={feret.maxDiameter.length.toFixed(2)}
          />
        );
      case 'roundness':
        return (
          <ValueRenderers.Text key={column} value={roundness.toFixed(2)} />
        );
      case 'solidity':
        return <ValueRenderers.Text key={column} value={solidity.toFixed(2)} />;
      case 'sphericity':
        return (
          <ValueRenderers.Text key={column} value={sphericity.toFixed(2)} />
        );
      case 'fillRatio':
        return (
          <ValueRenderers.Text key={column} value={fillRatio.toFixed(2)} />
        );
      default:
        throw new Error(`Unknown column`);
    }
  }, []);

  if (rois.length === 0) return <Empty>No ROIs generated</Empty>;

  return (
    <Table>
      <Table.Header>
        {columns.map((column) => (
          <ValueRenderers.Title key={column} value={startCase(column)} />
        ))}
      </Table.Header>
      {rois.map((roi) => (
        <Table.Row key={roi.id}>
          {columns.map((column) => columnRenderer(column, roi))}
        </Table.Row>
      ))}
    </Table>
  );
}

export default memo(ROITable);
