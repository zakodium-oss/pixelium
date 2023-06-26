import { memo, useCallback, useMemo } from 'react';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { ADD_INVERT } from '../../../state/data/DataActionTypes';
import FilterModal from '../FilterModal';

interface InvertModalProps {
  previewImageIdentifier: string;
}

function InvertModal({ previewImageIdentifier }: InvertModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const invertedImage = useMemo(() => pipelined.invert(), [pipelined]);

  const dataDispatch = useDataDispatch();
  const [isOpen, , close] = useModal('invert');

  const addInvertFilter = useCallback(() => {
    dataDispatch({
      type: ADD_INVERT,
      payload: {
        identifier: previewImageIdentifier,
      },
    });
    close();
  }, [close, dataDispatch, previewImageIdentifier]);

  return (
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Invert image"
      viewIdentifier="__invert_preview"
      apply={addInvertFilter}
      previewed={invertedImage}
    />
  );
}

export default memo(InvertModal);
