import { GreyAlgorithm, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_GREY_FILTER } from '../../../state/data/DataActionTypes';
import FastSelector from '../../FastSelector';
import FilterModal from '../PreviewModal';

interface ExportGreyModalProps {
  previewImageIdentifier: string;
}

function ExploreGreyModal({ previewImageIdentifier }: ExportGreyModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<GreyAlgorithm>(GreyAlgorithm.LUMA_709);

  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<GreyAlgorithm>(defaultOptions);

  const greyImage = useMemo(
    () =>
      pipelined instanceof Image
        ? pipelined.grey({
            algorithm: selectedAlgorithm,
          })
        : pipelined,
    [selectedAlgorithm, pipelined],
  );

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('grey');

  const addGreyFilter = useCallback(() => {
    dataDispatch({
      type: SET_GREY_FILTER,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: {
          algorithm: selectedAlgorithm,
        },
      },
    });
    close();
  }, [
    close,
    dataDispatch,
    opIdentifier,
    previewImageIdentifier,
    selectedAlgorithm,
  ]);

  return (
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Explore grey filters"
      viewIdentifier="__grey_filter_preview"
      apply={addGreyFilter}
      previewed={greyImage}
      editing={editing}
    >
      <FastSelector
        options={Object.values(GreyAlgorithm)}
        selected={selectedAlgorithm}
        setSelected={setSelectedAlgorithm}
      />
    </FilterModal>
  );
}

export default memo(ExploreGreyModal);
