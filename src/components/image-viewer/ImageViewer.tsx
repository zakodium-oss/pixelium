import { writeCanvas } from 'image-js';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMouseWheel } from 'react-use';

import useData from '../../hooks/useData';

interface ImageViewerProps {
  identifier: string;
}

function ImageViewer({ identifier }: ImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const data = useData();

  const image = useMemo(
    () => data.files[identifier].image,
    [data.files, identifier],
  );

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panningStart, setPanningStart] = useState({ x: 0, y: 0 });
  const zoomValue = useMouseWheel();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!image || canvas === null || context === null) return;

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();

    writeCanvas(image, canvas, {
      resizeCanvas: false,
      dx: pan.x,
      dy: pan.y,
    });
  }, [context, image, pan.x, pan.y]);

  // resize
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas === null || context === null) return;

    const { devicePixelRatio: ratio = 1 } = window;

    if (
      canvas.width !== canvas.offsetWidth ||
      canvas.height !== canvas.offsetHeight
    ) {
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      context.scale(ratio + zoomValue, ratio + zoomValue);
    }

    draw();
  }, [context, draw, zoomValue]);

  // pan
  const mouseDown = useCallback((event: MouseEvent) => {
    event.preventDefault();

    setIsPanning(true);
    setPanningStart({ x: event.offsetX, y: event.offsetY });
  }, []);

  const mouseMove = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (!isPanning || panningStart === null) return;
      setPan({
        x: pan.x + event.offsetX - panningStart.x,
        y: pan.y + event.offsetY - panningStart.y,
      });
      setPanningStart({ x: event.offsetX, y: event.offsetY });
    },
    [isPanning, pan.x, pan.y, panningStart],
  );

  const mouseUp = useCallback((event: MouseEvent) => {
    event.preventDefault();

    setIsPanning(false);
    setPanningStart({ x: 0, y: 0 });
  }, []);

  // set context on boot
  useEffect(() => {
    if (canvasRef.current === null) return;
    const context = canvasRef.current.getContext('2d');
    if (context === null) return;
    setContext(context);
  }, []);

  // canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null || context === null) return;

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mouseup', mouseUp);

    draw();

    return () => {
      observer.disconnect();
      canvas.removeEventListener('mousedown', mouseDown);
      canvas.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('mouseup', mouseUp);
    };
  }, [context, draw, image, mouseDown, mouseMove, mouseUp, resize]);

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
