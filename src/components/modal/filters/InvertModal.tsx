import { memo, useCallback, useMemo } from 'react';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_INVERT } from '../../../state/data/DataActionTypes';
import FilterModal from '../FilterModal';

interface InvertModalProps {
  previewImageIdentifier: string;
}

function InvertModal({ previewImageIdentifier }: InvertModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const { editing, opIdentifier } = useDefaultOptions<undefined>(undefined);

  const invertedImage = useMemo(() => pipelined.invert(), [pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('invert');

  const addInvertFilter = useCallback(() => {
    dataDispatch({
      type: SET_INVERT,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
      },
    });
    close();
  }, [close, dataDispatch, opIdentifier, previewImageIdentifier]);

  return (
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Invert image"
      viewIdentifier="__invert_preview"
      apply={addInvertFilter}
      previewed={invertedImage}
      editing={editing}
    />
  );
}

export default memo(InvertModal);
