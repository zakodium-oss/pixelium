import { Image, PixelateOptions } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Field, Input, Select } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_PIXELATE } from '../../../state/data/DataActionTypes';
import FilterModal from '../PreviewModal';

interface PixelateModalProps {
  previewImageIdentifier: string;
}

function PixelateModal({ previewImageIdentifier }: PixelateModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<PixelateOptions>({
      cellSize: 2,
      algorithm: 'center',
    });

  const { pipelined } = useImage(opIdentifier);

  const [options, setOptions] = useState<PixelateOptions>(defaultOptions);
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

  const pixelatedImage = useMemo(() => {
    if (pipelined instanceof Image) {
      try {
        return pipelined.pixelate(options);
      } catch {
        return null;
      }
    }

    return null;
  }, [options, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('pixelate');

  const addPixelateFilter = useCallback(() => {
    dataDispatch({
      type: SET_PIXELATE,
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
      title="Pixelate image"
      viewIdentifier="__pixelate_preview"
      apply={addPixelateFilter}
      original={pipelined}
      preview={pixelatedImage}
      editing={editing}
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
