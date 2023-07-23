import styled from '@emotion/styled';
import { memo, useEffect, useMemo, useRef } from 'react';

import useAnnotationRef from '../../hooks/useAnnotationRef';
import useROIs from '../../hooks/useROIs';

import ROIAnnotation from './annotation/ROIAnnotation';

interface ROIAnnotationsProps {
  identifier: string;
  width?: number;
  height?: number;
}

const AnnotationsWrapper = styled.div<{ width: number; height: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ width }) => width}px;
  height ${({ height }) => height}px;
`;

function ROIAnnotations({
  identifier,
  width = 0,
  height = 0,
}: ROIAnnotationsProps) {
  const rois = useROIs(identifier);
  const annotations = useMemo(
    () => rois.map((roi) => <ROIAnnotation key={roi.id} roi={roi} />),
    [rois],
  );

  const annotationsRef = useRef<SVGSVGElement>(null);
  const { svgRef, setSvgRef } = useAnnotationRef();

  useEffect(() => {
    if (annotationsRef.current === null) return;
    setSvgRef(annotationsRef);
  }, [setSvgRef, svgRef]);

  const viewBox = useMemo(() => `0 0 ${width} ${height}`, [width, height]);

  return (
    <AnnotationsWrapper width={width} height={height}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={viewBox}
        ref={annotationsRef}
      >
        {annotations}
      </svg>
    </AnnotationsWrapper>
  );
}

export default memo(ROIAnnotations);
