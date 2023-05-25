import { memo } from 'react';

import useImageViewer from '../../hooks/useImageViewer';

interface ImageViewerProps {
  identifier: string;
}

function ImageViewer({ identifier }: ImageViewerProps) {
  const { canvasRef } = useImageViewer(identifier);

  return (
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        width: '100%',
        height: '100%',
      }}
    />
  );
}

export default memo(ImageViewer);
