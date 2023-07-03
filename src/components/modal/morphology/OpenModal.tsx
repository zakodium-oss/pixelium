import styled from '@emotion/styled';
import { OpenOptions } from 'image-js';
import times from 'lodash/times';
import { memo, useCallback, useMemo, useState } from 'react';
import { Checkbox, Field, Input } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_OPEN } from '../../../state/data/DataActionTypes';
import changeKernelCell from '../../../utils/changeKernelCell';
import resizeKernel from '../../../utils/resizeKernel';
import FilterModal from '../PreviewModal';

interface OpenModalProps {
  previewImageIdentifier: string;
}

const KernelRow = styled.div`
  display: flex;
  flex-direction: row;
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

  const openedImage = useMemo(() => {
    try {
      return pipelined.open(openOptions);
    } catch {
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
    <FilterModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Open image"
      viewIdentifier="__open_preview"
      apply={addOpenMorph}
      original={pipelined}
      preview={openedImage}
      editing={editing}
    >
      <Field name="iterations" label="Iterations">
        <Input
          type="number"
          name="iterations"
          min={1}
          value={openOptions.iterations}
          onChange={(e) => {
            setOpenOptions({
              ...openOptions,
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
          value={openOptions.kernel[0].length}
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
      </Field>
      <Field name="kernelHeight" label="Kernel height">
        <Input
          type="number"
          name="kernelHeight"
          step={2}
          min={1}
          value={openOptions.kernel.length}
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
      </Field>

      <Field name="kernel" label="Kernel">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {times(openOptions.kernel.length, (h) => (
            <KernelRow key={h}>
              {times(openOptions.kernel[0].length, (w) => (
                <Checkbox
                  key={w}
                  checked={openOptions.kernel[h][w] === 1}
                  onChange={(checked) =>
                    setOpenOptions({
                      ...openOptions,
                      kernel: changeKernelCell(
                        openOptions.kernel,
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

export default memo(OpenModal);
