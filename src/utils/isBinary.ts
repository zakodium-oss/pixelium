import { Image, ImageColorModel, Mask } from 'image-js';

export default function isBinary(image: Image | Mask) {
  return image.colorModel === ImageColorModel.BINARY;
}
