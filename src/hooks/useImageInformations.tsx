import { Image } from 'image-js';
import { useMemo } from 'react';
import { tagNames } from 'tiff';

function getTagName(tagCode: string): string {
  return (
    tagNames.standard[tagCode] ||
    tagNames.exif[tagCode] ||
    tagNames.gps[tagCode] ||
    tagCode
  );
}

export default function useImageInformations(image: Image | null) {
  return useMemo(() => {
    if (image === null) return { info: {}, meta: {} };
    const info = {
      imageSize: `${image.width.toLocaleString()} x ${image.height.toLocaleString()} (${(
        image.width * image.height
      ).toLocaleString()} pixels)`,
      bitDepth: image.bitDepth,
      channels: image.channels,
      components: image.components,
      colorModel: image.colorModel,
    };

    const fields = Object.fromEntries(image.meta?.tiff?.fields || []);
    let meta: Record<string, unknown> = {};

    for (const [tagCode, tagValue] of Object.entries(fields)) {
      const tagName = getTagName(tagCode);
      if (typeof tagValue === 'string' && tagValue.startsWith('<')) {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(tagValue, 'text/xml');
          const dataNodes = xmlDoc.querySelectorAll('Data');
          for (const dataNode of dataNodes) {
            const label = dataNode.querySelector('Label')?.textContent;
            const value = dataNode.querySelector('Value')?.textContent;
            if (label && value) {
              const newTagName = tagName.concat('.').concat(label);
              meta[newTagName] = value;
            }
          }
        } catch {
          meta[tagName] = tagValue;
        }
      } else {
        meta[tagName] = tagValue;
      }
    }

    return { info, meta };
  }, [image]);
}
