import { Image, ImageColorModel } from 'image-js';

export default function isBinary(image: Image) {
  return image.colorModel === ImageColorModel.BINARY;
}
