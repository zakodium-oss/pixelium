import { Checkbox, InputGroup } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { ErodeOptions } from 'image-js';
import times from 'lodash/times';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_ERODE } from '../../../../state/data/DataActionTypes';
import changeKernelCell from '../../../../utils/changeKernelCell';
import resizeKernel from '../../../../utils/resizeKernel';
import PreviewModal from '../PreviewModal';

interface ErodeModalProps {
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

interface InternalErodeOptions extends ErodeOptions {
  kernel: number[][];
}

function ErodeModal({ previewImageIdentifier }: ErodeModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<InternalErodeOptions>({
      kernel: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      iterations: 1,
    });

  const { pipelined } = useImage(opIdentifier);

  const [erodeOptions, setErodeOptions] = useState<InternalErodeOptions>({
    ...defaultOptions,
  });

  const [algoError, setAlgoError] = useState<string>();
  const erodedImage = useMemo(() => {
    setAlgoError(undefined);
    try {
      return pipelined.erode(erodeOptions);
    } catch (error: any) {
      setAlgoError(error.message);
      return null;
    }
  }, [erodeOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('erode');

  const addDilateMorph = useCallback(() => {
    dataDispatch({
      type: SET_ERODE,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: erodeOptions,
      },
    });
    close();
  }, [close, dataDispatch, erodeOptions, opIdentifier, previewImageIdentifier]);

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Erode image"
      viewIdentifier="__erode_preview"
      apply={addDilateMorph}
      original={pipelined}
      preview={erodedImage}
      editing={editing}
      algoError={algoError}
    >
      <InputGroup
        type="number"
        name="iterations"
        min={1}
        value={erodeOptions.iterations?.toString()}
        onChange={(e) => {
          setErodeOptions({
            ...erodeOptions,
            iterations: e.target.valueAsNumber,
          });
        }}
      />
      <InputGroup
        type="number"
        name="kernelWidth"
        step={2}
        min={1}
        value={erodeOptions.kernel[0].length?.toString()}
        onChange={(e) => {
          setErodeOptions({
            ...erodeOptions,
            kernel: resizeKernel(
              erodeOptions.kernel,
              e.target.valueAsNumber,
              'x',
            ),
          });
        }}
      />
      <InputGroup
        type="number"
        name="kernelHeight"
        step={2}
        min={1}
        value={erodeOptions.kernel.length?.toString()}
        onChange={(e) => {
          setErodeOptions({
            ...erodeOptions,
            kernel: resizeKernel(
              erodeOptions.kernel,
              e.target.valueAsNumber,
              'y',
            ),
          });
        }}
      />
      <KernelGrid>
        {times(erodeOptions.kernel.length, (h) => (
          <KernelRow key={h}>
            {times(erodeOptions.kernel[0].length, (w) => (
              <Checkbox
                key={w}
                checked={erodeOptions.kernel[h][w] === 1}
                onChange={(e) =>
                  setErodeOptions({
                    ...erodeOptions,
                    kernel: changeKernelCell(
                      erodeOptions.kernel,
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
    </PreviewModal>
  );
}

export default memo(ErodeModal);
