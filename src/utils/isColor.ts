import { Image, Mask } from 'image-js';

export default function isColor(image: Image | Mask) {
  return image.colorModel.includes('RGB');
}
