import { FormGroup, InputGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { Image, PixelateOptions } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_PIXELATE } from '../../../../state/data/DataActionTypes';
import PreviewModal from '../PreviewModal';

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
      { label: 'Center', value: 'center' },
      { label: 'Mean', value: 'mean' },
      { label: 'Median', value: 'median' },
    ],
    [],
  );

  const [algoError, setAlgoError] = useState<string>();
  const pixelatedImage = useMemo(() => {
    setAlgoError(undefined);
    if (pipelined instanceof Image) {
      try {
        return pipelined.pixelate(options);
      } catch (error: any) {
        setAlgoError(error.message);
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
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Pixelate image"
      viewIdentifier="__pixelate_preview"
      apply={addPixelateFilter}
      original={pipelined}
      preview={pixelatedImage}
      editing={editing}
      algoError={algoError}
    >
      <FormGroup label="Cell size">
        <InputGroup
          type="number"
          min={2}
          value={options.cellSize?.toString()}
          onChange={(e) =>
            setOptions({
              ...options,
              cellSize: e.target.valueAsNumber,
            })
          }
        />
      </FormGroup>
      <FormGroup label="Algorithm">
        <Select
          activeItem={algorithmOptions.find(
            (item) => item.value === options.algorithm,
          )}
          items={algorithmOptions}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              key={item.value}
              text={item.label}
              onClick={handleClick}
              active={modifiers.active}
              disabled={modifiers.disabled}
              selected={item.value === options.algorithm}
            />
          )}
          onItemSelect={(item) =>
            setOptions({
              ...options,
              algorithm: item.value as PixelateOptions['algorithm'],
            })
          }
        />
      </FormGroup>
    </PreviewModal>
  );
}

export default memo(PixelateModal);
