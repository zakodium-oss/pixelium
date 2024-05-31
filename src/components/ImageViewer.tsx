import { Image, Mask, writeCanvas } from 'image-js';
import {
  CSSProperties,
  memo,
  MutableRefObject,
  useEffect,
  useMemo,
} from 'react';
import { RoiContainer, useTargetRef } from 'react-roi';

import useImage from '../hooks/useImage';

import ROIAnnotations from './roi/ROIAnnotations';

interface ImageViewerProps {
  identifier: string;
  image?: Image | Mask;
  showOriginal?: boolean;
  annotable?: boolean;
}

const canvasStyle: CSSProperties = {
  objectFit: 'contain',
  imageRendering: 'pixelated',
};

function TargetCanvas({ imageToShow }: { imageToShow: Image | Mask }) {
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useTargetRef() as any;

  useEffect(() => {
    if (canvasRef.current === null) return;
    writeCanvas(imageToShow, canvasRef.current);
  }, [canvasRef, imageToShow]);

  return <canvas ref={canvasRef} style={canvasStyle} />;
}

function ImageViewer({
  identifier,
  showOriginal = false,
  image,
  annotable = false,
}: ImageViewerProps) {
  const { original, pipelined } = useImage();

  const imageToShow = useMemo(() => {
    if (image !== undefined) return image;
    return showOriginal ? original : pipelined;
  }, [image, original, pipelined, showOriginal]);

  return (
    <RoiContainer
      zoomWithoutModifierKey
      target={<TargetCanvas imageToShow={imageToShow} />}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {annotable && (
        <ROIAnnotations
          width={imageToShow?.width}
          height={imageToShow?.height}
          identifier={identifier}
        />
      )}
    </RoiContainer>
  );
}

export default memo(ImageViewer);
