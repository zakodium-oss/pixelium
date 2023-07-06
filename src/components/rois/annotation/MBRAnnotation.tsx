import { Roi } from 'image-js';
import { memo } from 'react';

interface MBRAnnotationProps {
  roi: Roi;
}

function MBRAnnotation({ roi }: MBRAnnotationProps) {
  const svgPoints = roi.mbr.points
    .map((corner) => `${corner.column},${corner.row}`)
    .join(' ');
  return (
    <polygon
      points={svgPoints}
      style={{ fill: 'none', stroke: 'blue', strokeWidth: 1 }}
    />
  );
}

export default memo(MBRAnnotation);
