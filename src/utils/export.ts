import { encodePng, Image as ImageJS, readImg } from 'image-js';

export function svgElementToImage(
  svgElement: SVGSVGElement | null,
  { width, height }: { width: number; height: number },
) {
  return new Promise<ImageJS | null>((resolve) => {
    if (svgElement === null) {
      resolve(null);
      return;
    }
    const cloned = svgElement.cloneNode(true) as SVGSVGElement;
    if (cloned === undefined) {
      resolve(null);
      return;
    }
    cloned.width.baseVal.valueAsString = `${width}px`;
    cloned.height.baseVal.valueAsString = `${height}px`;

    const svg = `${cloned.outerHTML}`;
    const blob = new Blob([svg], {
      type: 'image/svg+xml',
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      resolve(null);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.addEventListener('load', () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(readImg(canvas));
      canvas.remove();
    });
    img.src = url;

    cloned.remove();
  });
}

export function saveToClipboard(image: ImageJS) {
  const data = encodePng(image);
  const blob = new Blob([data], { type: 'image/png' });
  try {
    return navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  } catch {
    // eslint-disable-next-line no-alert
    alert(
      'Your browser does not support this feature, please use Google Chrome.',
    );
    return null;
  }
}

export function saveAsPng(image: ImageJS, name: string) {
  const data = encodePng(image);
  const blob = new Blob([data], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.png`;
  link.click();
  URL.revokeObjectURL(url);
  link.remove();
}
