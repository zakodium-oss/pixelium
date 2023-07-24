import { v4 as uuid } from '@lukeed/uuid';
import { FifoLogger } from 'fifo-logger';
import { FileCollection } from 'file-collection';
import { decode, encode, encodePng, Image as ImageJS, readImg } from 'image-js';

import { DataState } from '../state/data/DataReducer';
import { PreferencesState } from '../state/preferences/PreferencesReducer';
import { ViewState } from '../state/view/ViewReducer';

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

export interface Bundle {
  name: string;
  data: DataState | null;
  preferences: PreferencesState | null;
  view: ViewState | null;
}

export async function extractImagesFromData(data: DataState) {
  const referedImages: { [key: string]: ImageJS } = {};
  for (const key of Object.keys(data.images)) {
    const image = data.images[key].image;
    const randomRef = uuid();
    data.images[key].image = randomRef as unknown as ImageJS;
    referedImages[randomRef] = image;
  }

  return {
    data,
    references: referedImages,
  };
}

export async function savePixeliumBundle({
  name,
  data,
  preferences,
  view,
}: Bundle) {
  const fileCollection = new FileCollection();
  if (data !== null) {
    const references = {};
    fileCollection.removeFile('data.json');
    const dataJson = JSON.stringify(data, (key, value) => {
      if (ArrayBuffer.isView(value)) {
        return Array.from(value as any);
      }

      if (value instanceof ImageJS) {
        const image = value;
        const ref = uuid();
        references[ref] = image;
        return ref;
      }

      return value;
    });
    await fileCollection.appendText('data.json', dataJson);

    for (const key of Object.keys(references)) {
      await fileCollection.set(`refs/${key}`, encode(references[key]));
    }
  }
  if (preferences !== null) {
    const preferencesJson = JSON.stringify(preferences);
    await fileCollection.appendText('preferences.json', preferencesJson);
  }
  if (view !== null) {
    const viewJson = JSON.stringify(view, (key, value) => {
      if (key === 'export') {
        return false;
      }
      return value;
    });
    await fileCollection.appendText('view.json', viewJson);
  }

  const buffer = await fileCollection.toIum({ includeData: true });
  const blob = new Blob([buffer], { type: 'application/pixelium' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.pixelium`;
  link.click();
  URL.revokeObjectURL(url);
  link.remove();
}

export async function loadPixeliumBundle(
  buffer: ArrayBuffer,
  logger: FifoLogger,
) {
  const fileCollection = await FileCollection.fromIum(buffer);

  let data: DataState | null = null;
  let preferences: PreferencesState | null = null;
  let view: ViewState | null = null;

  try {
    data = (await fileCollection.get('data.json')) as DataState;
  } catch {
    /* empty */
  }

  try {
    if (data !== null) {
      for (const key of Object.keys(data.images)) {
        const buffer = new Uint8Array(
          await fileCollection.get(
            `refs/${data.images[key].image as unknown as string}`,
          ),
        );

        data.images[key].image = decode(buffer);
      }
    }
  } catch (error) {
    logger.error(
      `Error while loading image in Pixelium file: ${error as string}`,
    );
  }

  try {
    preferences = await fileCollection.get('preferences.json');
  } catch {
    /* empty */
  }

  try {
    view = await fileCollection.get('view.json');
  } catch {
    /* empty */
  }

  return {
    data,
    preferences,
    view,
  };
}
