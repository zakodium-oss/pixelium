import { Checkbox, FormGroup, InputGroup } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { CloseOptions } from 'image-js';
import times from 'lodash/times';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_CLOSE } from '../../../../state/data/DataActionTypes';
import changeKernelCell from '../../../../utils/changeKernelCell';
import resizeKernel from '../../../../utils/resizeKernel';
import PreviewModal from '../PreviewModal';

interface CloseModalProps {
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

interface InternalCloseOptions extends CloseOptions {
  kernel: number[][];
}

function CloseModal({ previewImageIdentifier }: CloseModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<InternalCloseOptions>({
      kernel: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      iterations: 1,
    });

  const { pipelined } = useImage(opIdentifier);

  const [closeOptions, setCloseOptions] = useState<InternalCloseOptions>({
    ...defaultOptions,
  });

  const [algoError, setAlgoError] = useState<string>();
  const closedImage = useMemo(() => {
    setAlgoError(undefined);
    try {
      return pipelined.close(closeOptions);
    } catch (error: any) {
      setAlgoError(error.message);
      return null;
    }
  }, [closeOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('close');

  const addCloseMorph = useCallback(() => {
    dataDispatch({
      type: SET_CLOSE,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: closeOptions,
      },
    });
    close();
  }, [close, dataDispatch, closeOptions, opIdentifier, previewImageIdentifier]);

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Close image"
      viewIdentifier="__close_preview"
      apply={addCloseMorph}
      original={pipelined}
      preview={closedImage}
      editing={editing}
      algoError={algoError}
    >
      <FormGroup label="Iterations">
        <InputGroup
          type="number"
          name="iterations"
          min={1}
          value={closeOptions.iterations?.toString()}
          onChange={(e) => {
            setCloseOptions({
              ...closeOptions,
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
          value={closeOptions.kernel[0].length?.toString()}
          onChange={(e) => {
            setCloseOptions({
              ...closeOptions,
              kernel: resizeKernel(
                closeOptions.kernel,
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
          value={closeOptions.kernel.length?.toString()}
          onChange={(e) => {
            setCloseOptions({
              ...closeOptions,
              kernel: resizeKernel(
                closeOptions.kernel,
                e.target.valueAsNumber,
                'y',
              ),
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Kernel">
        <KernelGrid>
          {times(closeOptions.kernel.length, (h) => (
            <KernelRow key={h}>
              {times(closeOptions.kernel[0].length, (w) => (
                <Checkbox
                  key={w}
                  checked={closeOptions.kernel[h][w] === 1}
                  onChange={(e) =>
                    setCloseOptions({
                      ...closeOptions,
                      kernel: changeKernelCell(
                        closeOptions.kernel,
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

export default memo(CloseModal);
