import cloneDeep from 'lodash/cloneDeep';
import times from 'lodash/times';

export default function resizeKernel(
  kernel: number[][],
  newValue: number,
  axis: 'x' | 'y',
) {
  const newKernel = cloneDeep(kernel);
  const oldValue = axis === 'x' ? kernel[0].length : kernel.length;
  if (newValue > oldValue) {
    const diff = newValue - oldValue;
    times(diff, () => {
      if (axis === 'x') {
        for (const row of newKernel) row.push(0);
      } else {
        newKernel.push(new Array(newValue).fill(0));
      }
    });
  } else if (newValue < oldValue) {
    const diff = oldValue - newValue;
    times(diff, () => {
      if (axis === 'x') {
        for (const row of newKernel) row.pop();
      } else {
        newKernel.pop();
      }
    });
  }
  return newKernel;
}
