import cloneDeep from 'lodash/cloneDeep';

export default function changeKernelCell(
  kernel: number[][],
  x: number,
  y: number,
  value: boolean,
) {
  const newKernel = cloneDeep(kernel);
  newKernel[y][x] = value ? 1 : 0;
  return newKernel;
}
