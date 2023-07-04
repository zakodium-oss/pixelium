import { GradientFilterXYOptions, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_GRADIENT_FILTER } from '../../../state/data/DataActionTypes';
import PreviewModal from '../PreviewModal';

interface GradientFilterModalProps {
  previewImageIdentifier: string;
}

function GradientFilterModal({
  previewImageIdentifier,
}: GradientFilterModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<GradientFilterXYOptions>({
      kernelX: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
      ],
      kernelY: [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
      ],
    });

  const { pipelined } = useImage(opIdentifier);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gradientFilterOptions, setGradientFilterOptions] =
    useState<GradientFilterXYOptions>({
      ...defaultOptions,
    });

  const gradientFilteredImage = useMemo(() => {
    try {
      return pipelined instanceof Image
        ? pipelined.gradientFilter(gradientFilterOptions)
        : pipelined;
    } catch {
      return null;
    }
  }, [gradientFilterOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('gradient');

  const addGradientFilter = useCallback(() => {
    dataDispatch({
      type: SET_GRADIENT_FILTER,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: gradientFilterOptions,
      },
    });
    close();
  }, [
    close,
    dataDispatch,
    gradientFilterOptions,
    opIdentifier,
    previewImageIdentifier,
  ]);

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Gradient Filter"
      viewIdentifier="__gradientFilter_preview"
      apply={addGradientFilter}
      original={pipelined}
      preview={gradientFilteredImage}
      editing={editing}
    >
      XXX
    </PreviewModal>
  );
}

export default memo(GradientFilterModal);
