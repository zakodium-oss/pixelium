import { MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { FlipOptions, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_FLIP } from '../../../../state/data/DataActionTypes';
import PreviewModal from '../PreviewModal';

interface FlipModalProps {
  previewImageIdentifier: string;
}

function FlipModal({ previewImageIdentifier }: FlipModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<FlipOptions>({
      axis: 'horizontal',
    });

  const { pipelined } = useImage(opIdentifier);

  const [options, setOptions] = useState<FlipOptions>(defaultOptions);

  const axisOptions = useMemo(
    () => [
      { label: 'Horizontal', value: 'horizontal' },
      { label: 'Vertical', value: 'vertical' },
      { label: 'Both', value: 'both' },
    ],
    [],
  );

  const [algoError, setAlgoError] = useState<string>();
  const flippedImage = useMemo(() => {
    setAlgoError(undefined);
    if (pipelined instanceof Image) {
      try {
        return pipelined.flip(options);
      } catch (error: any) {
        setAlgoError(error.message);
        return null;
      }
    }
    return null;
  }, [options, pipelined]);

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
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Flip image"
      viewIdentifier="__flip_preview"
      apply={addFlipFilter}
      original={pipelined}
      preview={flippedImage}
      editing={editing}
      algoError={algoError}
    >
      <Select
        activeItem={axisOptions.find((item) => item.value === options.axis)}
        items={axisOptions}
        itemRenderer={(item, { handleClick, modifiers }) => (
          <MenuItem
            key={item.value}
            text={item.label}
            onClick={handleClick}
            active={modifiers.active}
            disabled={modifiers.disabled}
            selected={item.value === options.axis}
          />
        )}
        onItemSelect={(item) =>
          setOptions({
            axis: item.value as FlipOptions['axis'],
          })
        }
      />
    </PreviewModal>
  );
}

export default memo(FlipModal);
