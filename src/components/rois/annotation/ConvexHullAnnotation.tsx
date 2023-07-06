import { Roi } from 'image-js';
import { memo } from 'react';

interface ConvexHullAnnotationProps {
  roi: Roi;
}

function ConvexHullAnnotation({ roi }: ConvexHullAnnotationProps) {
  const svgPoints = roi.convexHull.points
    .map((corner) => `${corner.column},${corner.row}`)
    .join(' ');
  return (
    <polygon
      points={svgPoints}
      style={{ fill: 'none', stroke: 'red', strokeWidth: 2 }}
    />
  );
}

export default memo(ConvexHullAnnotation);
