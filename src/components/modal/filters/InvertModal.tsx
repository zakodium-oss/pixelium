import { memo, useCallback, useMemo } from 'react';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_INVERT } from '../../../state/data/DataActionTypes';
import FilterModal from '../PreviewModal';

interface InvertModalProps {
  previewImageIdentifier: string;
}

function InvertModal({ previewImageIdentifier }: InvertModalProps) {
  const { editing, opIdentifier } = useDefaultOptions<undefined>(undefined);

  const { pipelined } = useImage(previewImageIdentifier, opIdentifier);

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
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Invert image"
      viewIdentifier="__invert_preview"
      apply={addInvertFilter}
      original={pipelined}
      preview={invertedImage}
      editing={editing}
    />
  );
}

export default memo(InvertModal);
