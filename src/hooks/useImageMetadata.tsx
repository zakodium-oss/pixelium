import { Image } from 'image-js';
import { useMemo } from 'react';
import { ValueRenderers } from 'react-science/ui';

function getComponent(value: unknown) {
  switch (typeof value) {
    case 'string':
      return <ValueRenderers.Text value={value} />;
    case 'number':
      return <ValueRenderers.Number value={value} />;
    case 'boolean':
      return <ValueRenderers.Boolean value={value} />;
    case 'object':
      return <ValueRenderers.Object value={value || {}} />;
    default:
      return null;
  }
}

function getDisplayKey(key: string) {
  return key.replaceAll(/(?<capitals>[A-Z])/g, ' $<capitals>').trim();
}

export default function useImageMetadata(image: Image | null) {
  return useMemo(() => {
    if (image === null) return [];
    if (image.meta === undefined) return [];

    return Object.entries(image.meta.tiff.tags).map(([key, value]) => ({
      key: getDisplayKey(key),
      render: getComponent(value),
    }));
  }, [image]);
}
