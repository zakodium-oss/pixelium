import styled from '@emotion/styled';
import { Roi } from 'image-js';
import { memo, useMemo } from 'react';

import usePreferences from '../../../hooks/usePreferences';

const StyledPolygon = styled.polygon<{ color: string }>`
  fill: none;
  stroke: ${({ color }) => color};
  strokewidth: 1;
`;

interface ConvexHullAnnotationProps {
  roi: Roi;
}

function ConvexHullAnnotation({ roi }: ConvexHullAnnotationProps) {
  const svgPoints = useMemo(
    () =>
      roi.convexHull.points
        .map((corner) => `${corner.column},${corner.row}`)
        .join(' '),
    [roi.convexHull.points],
  );

  const preferences = usePreferences();
  const color = useMemo(
    () => preferences.rois.annotations.convexHull.color,
    [preferences.rois.annotations.convexHull.color],
  );

  if (!preferences.rois.annotations.convexHull.enabled) return null;

  return <StyledPolygon points={svgPoints} color={color} />;
}

export default memo(ConvexHullAnnotation);
