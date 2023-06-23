import { memo, useCallback, useMemo } from 'react';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useImage from '../../../hooks/useImage';
import { ADD_INVERT } from '../../../state/data/DataActionTypes';
import FilterModal from '../FilterModal';

interface InvertModalProps {
  isOpenDialog: boolean;
  closeDialog: () => void;
  previewImageIdentifier: string;
}

function InvertModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: InvertModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const invertedImage = useMemo(() => pipelined.invert(), [pipelined]);

  const dataDispatch = useDataDispatch();

  const addInvertFilter = useCallback(() => {
    dataDispatch({
      type: ADD_INVERT,
      payload: {
        identifier: previewImageIdentifier,
      },
    });
    closeDialog();
  }, [closeDialog, dataDispatch, previewImageIdentifier]);

  return (
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={closeDialog}
      isOpenDialog={isOpenDialog}
      title="Invert image"
      viewIdentifier="__invert_preview"
      apply={addInvertFilter}
      previewed={invertedImage}
    />
  );
}

export default memo(InvertModal);
