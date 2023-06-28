import styled from '@emotion/styled';
import { memo } from 'react';
import { Table, ValueRenderers } from 'react-science/ui';

import useRois from '../../hooks/useRois()';

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
  const rois = useRois(identifier);

  if (rois.length === 0) return <Empty>No ROIs generated</Empty>;

  return (
    <Table>
      <Table.Header>
        <ValueRenderers.Title value="#" />
        <ValueRenderers.Title value="Width" />
        <ValueRenderers.Title value="Height" />
        <ValueRenderers.Title value="Surface" />
        <ValueRenderers.Title value="Aspect ratio" />
        <ValueRenderers.Title value="Feret min diameter" />
        <ValueRenderers.Title value="Feret max diameter" />
        <ValueRenderers.Title value="Roundness" />
        <ValueRenderers.Title value="Solidity" />
        <ValueRenderers.Title value="Sphericity" />
        <ValueRenderers.Title value="Fill ratio" />
      </Table.Header>
      {rois.map(
        (
          {
            id,
            width,
            height,
            surface,
            feret,
            roundness,
            solidity,
            sphericity,
            fillRatio,
          },
          index,
        ) => (
          <Table.Row key={id}>
            <ValueRenderers.Number value={index + 1} />
            <ValueRenderers.Number value={width} />
            <ValueRenderers.Number value={height} />
            <ValueRenderers.Number value={surface} />
            <ValueRenderers.Text value={feret.aspectRatio.toFixed(2)} />
            <ValueRenderers.Text value={feret.minDiameter.length.toFixed(2)} />
            <ValueRenderers.Text value={feret.maxDiameter.length.toFixed(2)} />
            <ValueRenderers.Text value={roundness.toFixed(2)} />
            <ValueRenderers.Text value={solidity.toFixed(2)} />
            <ValueRenderers.Text value={sphericity.toFixed(2)} />
            <ValueRenderers.Text value={fillRatio.toFixed(2)} />
          </Table.Row>
        ),
      )}
    </Table>
  );
}

export default memo(ROITable);
