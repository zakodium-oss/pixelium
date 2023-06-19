import { Image, Mask } from 'image-js';

export default function isGrey(image: Image | Mask) {
  return image.colorModel.includes('GREY');
}
