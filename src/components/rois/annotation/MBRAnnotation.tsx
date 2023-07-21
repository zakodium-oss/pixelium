import styled from '@emotion/styled';
import { Roi } from 'image-js';
import { memo, useMemo } from 'react';

import usePreferences from '../../../hooks/usePreferences';

const StyledPolygon = styled.polygon<{ color: string }>`
  fill: none;
  stroke: ${({ color }) => color};
  strokewidth: 1;
`;

interface MBRAnnotationProps {
  roi: Roi;
}

function MBRAnnotation({ roi }: MBRAnnotationProps) {
  const svgPoints = useMemo(
    () =>
      roi.mbr.points
        .map((corner) => `${corner.column},${corner.row}`)
        .join(' '),
    [roi.mbr.points],
  );
  const preferences = usePreferences();
  const color = useMemo(
    () => preferences.rois.annotations.minimalBoundingRectangle.color,
    [preferences.rois.annotations.minimalBoundingRectangle.color],
  );

  if (!preferences.rois.annotations.minimalBoundingRectangle.enabled) {
    return null;
  }

  return <StyledPolygon points={svgPoints} color={color} />;
}

export default memo(MBRAnnotation);
