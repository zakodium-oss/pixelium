import { Image } from 'image-js';

export default function isColor(image: Image) {
  return image.colorModel.includes('RGB');
}
