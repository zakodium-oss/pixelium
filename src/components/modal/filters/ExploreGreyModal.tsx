import { GreyAlgorithm, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { ADD_GREY_FILTER } from '../../../state/data/DataActionTypes';
import FastSelector from '../../FastSelector';
import FilterModal from '../FilterModal';

interface ExportGreyModalProps {
  previewImageIdentifier: string;
}

function ExploreGreyModal({ previewImageIdentifier }: ExportGreyModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    GreyAlgorithm | undefined
  >(GreyAlgorithm.LUMA_709);

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
  const [isOpen, , close] = useModal('grey');

  const addGreyFilter = useCallback(() => {
    dataDispatch({
      type: ADD_GREY_FILTER,
      payload: {
        identifier: previewImageIdentifier,
        options: {
          algorithm: selectedAlgorithm,
        },
      },
    });
    close();
  }, [close, dataDispatch, previewImageIdentifier, selectedAlgorithm]);

  return (
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Explore grey filters"
      viewIdentifier="__grey_filter_preview"
      apply={addGreyFilter}
      previewed={greyImage}
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
