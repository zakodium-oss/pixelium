import styled from '@emotion/styled';
import { ErodeOptions } from 'image-js';
import times from 'lodash/times';
import { memo, useCallback, useMemo, useState } from 'react';
import { Checkbox, Field, Input } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_ERODE } from '../../../state/data/DataActionTypes';
import changeKernelCell from '../../../utils/changeKernelCell';
import resizeKernel from '../../../utils/resizeKernel';
import PreviewModal from '../PreviewModal';

interface ErodeModalProps {
  previewImageIdentifier: string;
}

const KernelRow = styled.div`
  display: flex;
  flex-direction: row;
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
      <Field name="iterations" label="Iterations">
        <Input
          type="number"
          name="iterations"
          min={1}
          value={erodeOptions.iterations}
          onChange={(e) => {
            setErodeOptions({
              ...erodeOptions,
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
          value={erodeOptions.kernel[0].length}
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
      </Field>
      <Field name="kernelHeight" label="Kernel height">
        <Input
          type="number"
          name="kernelHeight"
          step={2}
          min={1}
          value={erodeOptions.kernel.length}
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
      </Field>

      <Field name="kernel" label="Kernel">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {times(erodeOptions.kernel.length, (h) => (
            <KernelRow key={h}>
              {times(erodeOptions.kernel[0].length, (w) => (
                <Checkbox
                  key={w}
                  checked={erodeOptions.kernel[h][w] === 1}
                  onChange={(checked) =>
                    setErodeOptions({
                      ...erodeOptions,
                      kernel: changeKernelCell(
                        erodeOptions.kernel,
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
    </PreviewModal>
  );
}

export default memo(ErodeModal);
