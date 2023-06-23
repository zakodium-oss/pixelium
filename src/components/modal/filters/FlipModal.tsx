import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FlipOptions, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Field, Modal, Select } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useImage from '../../../hooks/useImage';
import { ADD_FLIP } from '../../../state/data/DataActionTypes';
import FilterModal from '../FilterModal';

interface FlipModalProps {
  isOpenDialog: boolean;
  closeDialog: () => void;
  previewImageIdentifier: string;
}

function FlipModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: FlipModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const dataDispatch = useDataDispatch();

  const [options, setOptions] = useState<FlipOptions>({
    axis: 'horizontal',
  });
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

  const addFlipFilter = useCallback(() => {
    dataDispatch({
      type: ADD_FLIP,
      payload: {
        identifier: previewImageIdentifier,
        options,
      },
    });
    closeDialog();
  }, [closeDialog, dataDispatch, options, previewImageIdentifier]);

  return (
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={closeDialog}
      isOpenDialog={isOpenDialog}
      title="Flip image"
      viewIdentifier="__flip_preview"
      apply={addFlipFilter}
      previewed={flippedImage}
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
