import styled from '@emotion/styled';
import { DilateOptions } from 'image-js';
import cloneDeep from 'lodash/cloneDeep';
import times from 'lodash/times';
import { memo, useCallback, useMemo, useState } from 'react';
import { Checkbox, Field, Input } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_DILATE } from '../../../state/data/DataActionTypes';
import FilterModal from '../PreviewModal';

interface DilateModalProps {
  previewImageIdentifier: string;
}

const KernelRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

function changeCell(kernel: number[][], x: number, y: number, value: boolean) {
  const newKernel = cloneDeep(kernel);
  newKernel[y][x] = value ? 1 : 0;
  return newKernel;
}

function resizeKernel(kernel: number[][], newValue: number, axis: 'x' | 'y') {
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

interface InternalDilateOptions extends DilateOptions {
  kernel: number[][];
}

function DilateModal({ previewImageIdentifier }: DilateModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<InternalDilateOptions>({
      kernel: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      iterations: 1,
    });

  const { pipelined } = useImage(opIdentifier);

  const [dilateOptions, setDilateOptions] = useState<InternalDilateOptions>({
    ...defaultOptions,
  });

  const dilatedImage = useMemo(() => {
    try {
      return pipelined.dilate(dilateOptions);
    } catch {
      return null;
    }
  }, [dilateOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('dilate');

  const addDilateMorph = useCallback(() => {
    dataDispatch({
      type: SET_DILATE,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: dilateOptions,
      },
    });
    close();
  }, [
    close,
    dataDispatch,
    dilateOptions,
    opIdentifier,
    previewImageIdentifier,
  ]);

  return (
    <FilterModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Dilate image"
      viewIdentifier="__dilate_preview"
      apply={addDilateMorph}
      original={pipelined}
      preview={dilatedImage}
      editing={editing}
    >
      <Field name="iterations" label="Iterations">
        <Input
          type="number"
          name="iterations"
          min={1}
          value={dilateOptions.iterations}
          onChange={(e) => {
            setDilateOptions({
              ...dilateOptions,
              iterations: e.target.valueAsNumber,
            });
          }}
        />
      </Field>
      <Field name="kernelWidth" label="Kernel width">
        <Input
          type="number"
          name="kernelWidth"
          step={2}
          min={1}
          value={dilateOptions.kernel[0].length}
          onChange={(e) => {
            setDilateOptions({
              ...dilateOptions,
              kernel: resizeKernel(
                dilateOptions.kernel,
                e.target.valueAsNumber,
                'x',
              ),
            });
          }}
        />
      </Field>
      <Field name="kernelHeight" label="Kernel height">
        <Input
          type="number"
          name="kernelHeight"
          step={2}
          min={1}
          value={dilateOptions.kernel.length}
          onChange={(e) => {
            setDilateOptions({
              ...dilateOptions,
              kernel: resizeKernel(
                dilateOptions.kernel,
                e.target.valueAsNumber,
                'y',
              ),
            });
          }}
        />
      </Field>

      <Field name="kernel" label="Kernel">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {times(dilateOptions.kernel.length, (h) => (
            <KernelRow key={h}>
              {times(dilateOptions.kernel[0].length, (w) => (
                <Checkbox
                  key={w}
                  checked={dilateOptions.kernel[h][w] === 1}
                  onChange={(checked) =>
                    setDilateOptions({
                      ...dilateOptions,
                      kernel: changeCell(
                        dilateOptions.kernel,
                        w,
                        h,
                        checked as boolean,
                      ),
                    })
                  }
                />
              ))}
            </KernelRow>
          ))}
        </div>
      </Field>
    </FilterModal>
  );
}

export default memo(DilateModal);
