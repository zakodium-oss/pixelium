import { Image, PixelateOptions } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Field, Input, Select } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { ADD_PIXELATE } from '../../../state/data/DataActionTypes';
import FilterModal from '../FilterModal';

interface PixelateModalProps {
  previewImageIdentifier: string;
}

function PixelateModal({ previewImageIdentifier }: PixelateModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const dataDispatch = useDataDispatch();
  const [isOpen, , close] = useModal('pixelate');

  const [options, setOptions] = useState<PixelateOptions>({
    cellSize: 2,
    algorithm: 'center',
  });
  const algorithmOptions = useMemo(
    () => [
      [
        { label: 'Center', value: 'center' },
        { label: 'Mean', value: 'mean' },
        { label: 'Median', value: 'median' },
      ],
    ],
    [],
  );

  const pixelatedImage = useMemo(
    () =>
      pipelined instanceof Image ? pipelined.pixelate(options) : pipelined,
    [options, pipelined],
  );

  const addPixelateFilter = useCallback(() => {
    dataDispatch({
      type: ADD_PIXELATE,
      payload: {
        identifier: previewImageIdentifier,
        options,
      },
    });
    close();
  }, [close, dataDispatch, options, previewImageIdentifier]);

  return (
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Pixelate image"
      viewIdentifier="__pixelate_preview"
      apply={addPixelateFilter}
      previewed={pixelatedImage}
    >
      <Field name="cellSize" label="Cell size">
        <Input
          type="number"
          min={2}
          value={options.cellSize}
          onChange={(e) =>
            setOptions({
              ...options,
              cellSize: e.target.valueAsNumber,
            })
          }
        />
      </Field>
      <Field name="algorithm" label="Algorithm">
        <Select
          value={options.algorithm}
          options={algorithmOptions}
          onSelect={(value) =>
            setOptions({
              ...options,
              algorithm: value as PixelateOptions['algorithm'],
            })
          }
        />
      </Field>
    </FilterModal>
  );
}

export default memo(PixelateModal);
