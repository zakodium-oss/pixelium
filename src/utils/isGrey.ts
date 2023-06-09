import { Image } from 'image-js';

export default function isGrey(image: Image) {
  return image.colorModel.includes('GREY');
}
