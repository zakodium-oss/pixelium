import { Roi } from 'image-js';
import { memo } from 'react';

import ConvexHullAnnotation from './ConvexHullAnnotation';
import FeretAnnotation from './FeretAnnotation';
import MBRAnnotation from './MBRAnnotation';

interface ROIAnnotationProps {
  roi: Roi;
}
function ROIAnnotation({ roi }: ROIAnnotationProps) {
  const { column: x, row: y } = roi.origin;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <MBRAnnotation roi={roi} />
      <FeretAnnotation roi={roi} />
      <ConvexHullAnnotation roi={roi} />
    </g>
  );
}

export default memo(ROIAnnotation);
