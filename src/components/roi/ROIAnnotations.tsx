import { CSSProperties, memo, useEffect, useMemo, useRef } from 'react';

import useAnnotationRef from '../../hooks/useAnnotationRef';
import useROIFilters, { getRealFilteredROIs } from '../../hooks/useROIFilters';
import useROIs from '../../hooks/useROIs';

import ROIAnnotation from './annotation/ROIAnnotation';

interface ROIAnnotationsProps {
  identifier: string;
  width?: number;
  height?: number;
}

function ROIAnnotations({
  identifier,
  width = 0,
  height = 0,
}: ROIAnnotationsProps) {
  const rois = useROIs(identifier);
  const { filteredROIs } = useROIFilters({ identifier });

  const realFilteredROIs = useMemo(
    () => getRealFilteredROIs(rois, filteredROIs),
    [rois, filteredROIs],
  );
  const annotations = useMemo(
    () =>
      realFilteredROIs.map((roi) => <ROIAnnotation key={roi.id} roi={roi} />),
    [realFilteredROIs],
  );

  const annotationsRef = useRef<SVGSVGElement>(null);
  const { svgRef, setSvgRef } = useAnnotationRef();

  useEffect(() => {
    if (annotationsRef.current === null) return;
    setSvgRef(annotationsRef);
  }, [setSvgRef, svgRef]);

  const viewBox = useMemo(() => `0 0 ${width} ${height}`, [width, height]);
  const style: CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      left: 0,
      top: 0,
      width: `${width}px`,
      height: `${height}px`,
    }),
    [width, height],
  );

  return (
    <div style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={viewBox}
        ref={annotationsRef}
      >
        {annotations}
      </svg>
    </div>
  );
}

export default memo(ROIAnnotations);
