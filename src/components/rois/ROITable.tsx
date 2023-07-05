import styled from '@emotion/styled';
import { Roi } from 'image-js';
import startCase from 'lodash/startCase';
import { memo, useCallback, useMemo } from 'react';
import { Table, ValueRenderers } from 'react-science/ui';

import usePreferences from '../../hooks/usePreferences';
import useROIs from '../../hooks/useROIs';
import {
  availableRoiColumns,
  RoiColumn,
} from '../../state/preferences/PreferencesReducer';

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
  const { roisPreferences } = usePreferences();

  const shownColumns = useMemo(() => {
    return roisPreferences[identifier]?.columns || availableRoiColumns;
  }, [identifier, roisPreferences]);

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
        return <ValueRenderers.Number value={id} />;
      case 'column':
        return <ValueRenderers.Number value={x} />;
      case 'row':
        return <ValueRenderers.Number value={y} />;
      case 'width':
        return <ValueRenderers.Number value={width} />;
      case 'height':
        return <ValueRenderers.Number value={height} />;
      case 'surface':
        return <ValueRenderers.Number value={surface} />;
      case 'feretAspectRatio':
        return <ValueRenderers.Text value={feret.aspectRatio.toFixed(2)} />;
      case 'feretMinDiameter':
        return (
          <ValueRenderers.Text value={feret.minDiameter.length.toFixed(2)} />
        );
      case 'feretMaxDiameter':
        return (
          <ValueRenderers.Text value={feret.maxDiameter.length.toFixed(2)} />
        );
      case 'roundness':
        return <ValueRenderers.Text value={roundness.toFixed(2)} />;
      case 'solidity':
        return <ValueRenderers.Text value={solidity.toFixed(2)} />;
      case 'sphericity':
        return <ValueRenderers.Text value={sphericity.toFixed(2)} />;
      case 'fillRatio':
        return <ValueRenderers.Text value={fillRatio.toFixed(2)} />;
      default:
        throw new Error(`Unknown column`);
    }
  }, []);

  if (rois.length === 0) return <Empty>No ROIs generated</Empty>;

  return (
    <Table>
      <Table.Header>
        {shownColumns.map((column) => (
          <ValueRenderers.Title key={column} value={startCase(column)} />
        ))}
      </Table.Header>
      {rois.map((roi) => (
        <Table.Row key={roi.id}>
          {shownColumns.map((column) => columnRenderer(column, roi))}
        </Table.Row>
      ))}
    </Table>
  );
}

export default memo(ROITable);
