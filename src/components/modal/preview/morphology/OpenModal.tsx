import { Checkbox, InputGroup } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { OpenOptions } from 'image-js';
import times from 'lodash/times';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_OPEN } from '../../../../state/data/DataActionTypes';
import changeKernelCell from '../../../../utils/changeKernelCell';
import resizeKernel from '../../../../utils/resizeKernel';
import PreviewModal from '../PreviewModal';

interface OpenModalProps {
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

interface InternalOpenOptions extends OpenOptions {
  kernel: number[][];
}

function OpenModal({ previewImageIdentifier }: OpenModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<InternalOpenOptions>({
      kernel: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      iterations: 1,
    });

  const { pipelined } = useImage(opIdentifier);

  const [openOptions, setOpenOptions] = useState<InternalOpenOptions>({
    ...defaultOptions,
  });

  const [algoError, setAlgoError] = useState<string>();
  const openedImage = useMemo(() => {
    setAlgoError(undefined);
    try {
      return pipelined.open(openOptions);
    } catch (error: any) {
      setAlgoError(error.message);
      return null;
    }
  }, [openOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('open');

  const addOpenMorph = useCallback(() => {
    dataDispatch({
      type: SET_OPEN,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: openOptions,
      },
    });
    close();
  }, [close, dataDispatch, openOptions, opIdentifier, previewImageIdentifier]);

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Open image"
      viewIdentifier="__open_preview"
      apply={addOpenMorph}
      original={pipelined}
      preview={openedImage}
      editing={editing}
      algoError={algoError}
    >
      <InputGroup
        type="number"
        name="iterations"
        min={1}
        value={openOptions.iterations?.toString()}
        onChange={(e) => {
          setOpenOptions({
            ...openOptions,
            iterations: e.target.valueAsNumber,
          });
        }}
      />
      <InputGroup
        type="number"
        name="kernelWidth"
        step={2}
        min={1}
        value={openOptions.kernel[0].length?.toString()}
        onChange={(e) => {
          setOpenOptions({
            ...openOptions,
            kernel: resizeKernel(
              openOptions.kernel,
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
        value={openOptions.kernel.length?.toString()}
        onChange={(e) => {
          setOpenOptions({
            ...openOptions,
            kernel: resizeKernel(
              openOptions.kernel,
              e.target.valueAsNumber,
              'y',
            ),
          });
        }}
      />
      <KernelGrid>
        {times(openOptions.kernel.length, (h) => (
          <KernelRow key={h}>
            {times(openOptions.kernel[0].length, (w) => (
              <Checkbox
                key={w}
                checked={openOptions.kernel[h][w] === 1}
                onChange={(e) =>
                  setOpenOptions({
                    ...openOptions,
                    kernel: changeKernelCell(
                      openOptions.kernel,
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

export default memo(OpenModal);
