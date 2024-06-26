import { Checkbox, FormGroup, InputGroup } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { DilateOptions } from 'image-js';
import times from 'lodash/times';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_DILATE } from '../../../../state/data/DataActionTypes';
import changeKernelCell from '../../../../utils/changeKernelCell';
import resizeKernel from '../../../../utils/resizeKernel';
import PreviewModal from '../PreviewModal';

interface DilateModalProps {
  previewImageIdentifier: string;
}

const KernelRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const KernelGrid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

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

  const [algoError, setAlgoError] = useState<string>();
  const dilatedImage = useMemo(() => {
    setAlgoError(undefined);
    try {
      return pipelined.dilate(dilateOptions);
    } catch (error: any) {
      setAlgoError(error.message);
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
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Dilate image"
      viewIdentifier="__dilate_preview"
      apply={addDilateMorph}
      original={pipelined}
      preview={dilatedImage}
      editing={editing}
      algoError={algoError}
    >
      <FormGroup label="Iterations">
        <InputGroup
          type="number"
          name="iterations"
          min={1}
          value={dilateOptions.iterations?.toString()}
          onChange={(e) => {
            setDilateOptions({
              ...dilateOptions,
              iterations: e.target.valueAsNumber,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Kernel width">
        <InputGroup
          type="number"
          name="kernelWidth"
          step={2}
          min={1}
          value={dilateOptions.kernel[0].length?.toString()}
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
      </FormGroup>
      <FormGroup label="Kernel height">
        <InputGroup
          type="number"
          name="kernelHeight"
          step={2}
          min={1}
          value={dilateOptions.kernel.length?.toString()}
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
      </FormGroup>
      <FormGroup label="Kernel">
        <KernelGrid>
          {times(dilateOptions.kernel.length, (h) => (
            <KernelRow key={h}>
              {times(dilateOptions.kernel[0].length, (w) => (
                <Checkbox
                  key={w}
                  checked={dilateOptions.kernel[h][w] === 1}
                  onChange={(e) =>
                    setDilateOptions({
                      ...dilateOptions,
                      kernel: changeKernelCell(
                        dilateOptions.kernel,
                        w,
                        h,
                        e.target.checked,
                      ),
                    })
                  }
                />
              ))}
            </KernelRow>
          ))}
        </KernelGrid>
      </FormGroup>
    </PreviewModal>
  );
}

export default memo(DilateModal);
