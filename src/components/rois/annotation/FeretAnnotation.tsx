import { Roi } from 'image-js';
import { memo } from 'react';

interface FeretAnnotationProps {
  roi: Roi;
}

function FeretAnnotation({ roi }: FeretAnnotationProps) {
  const { minDiameter, maxDiameter } = roi.feret;

  const lines = [minDiameter, maxDiameter].map(
    ({
      points: [{ column: columnA, row: rowA }, { column: columnB, row: rowB }],
    }) => ({
      x1: columnA,
      y1: rowA,
      x2: columnB,
      y2: rowB,
    }),
  );

  return (
    <>
      {lines.map(({ x1, y1, x2, y2 }) => (
        <line
          key={roi.id}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{ stroke: 'black', strokeWidth: 1 }}
        />
      ))}
    </>
  );
}

export default memo(FeretAnnotation);
