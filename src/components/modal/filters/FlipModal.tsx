import { FlipOptions, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Field, Select } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_FLIP } from '../../../state/data/DataActionTypes';
import FilterModal from '../PreviewModal';

interface FlipModalProps {
  previewImageIdentifier: string;
}

function FlipModal({ previewImageIdentifier }: FlipModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<FlipOptions>({
      axis: 'horizontal',
    });

  const { pipelined } = useImage(previewImageIdentifier, opIdentifier);

  const [options, setOptions] = useState<FlipOptions>(defaultOptions);
  const axisOptions = useMemo(
    () => [
      [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Both', value: 'both' },
      ],
    ],
    [],
  );

  const flippedImage = useMemo(
    () => (pipelined instanceof Image ? pipelined.flip(options) : pipelined),
    [options, pipelined],
  );

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('flip');

  const addFlipFilter = useCallback(() => {
    dataDispatch({
      type: SET_FLIP,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options,
      },
    });
    close();
  }, [close, dataDispatch, opIdentifier, options, previewImageIdentifier]);

  return (
    <FilterModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Flip image"
      viewIdentifier="__flip_preview"
      apply={addFlipFilter}
      original={pipelined}
      preview={flippedImage}
      editing={editing}
    >
      <Field name="axis" label="Axis">
        <Select
          value={options.axis}
          options={axisOptions}
          onSelect={(value) =>
            setOptions({
              axis: value as 'horizontal' | 'vertical' | 'both' | undefined,
            })
          }
        />
      </Field>
    </FilterModal>
  );
}

export default memo(FlipModal);
