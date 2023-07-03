import { GreyAlgorithm, GreyOptions, Image } from 'image-js';
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
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<GreyOptions>({ algorithm: GreyAlgorithm.LUMA_709 });

  const { pipelined } = useImage(opIdentifier);

  const [greyOptions, setGreyOptions] = useState<GreyOptions>(defaultOptions);

  const greyImage = useMemo(
    () =>
      pipelined instanceof Image ? pipelined.grey(greyOptions) : pipelined,
    [pipelined, greyOptions],
  );

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('grey');

  const addGreyFilter = useCallback(() => {
    dataDispatch({
      type: SET_GREY_FILTER,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: greyOptions,
      },
    });
    close();
  }, [close, dataDispatch, greyOptions, opIdentifier, previewImageIdentifier]);

  return (
    <FilterModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Explore grey filters"
      viewIdentifier="__grey_filter_preview"
      apply={addGreyFilter}
      original={pipelined}
      preview={greyImage}
      editing={editing}
    >
      <FastSelector
        options={Object.values(GreyAlgorithm)}
        selected={greyOptions.algorithm as GreyAlgorithm}
        setSelected={(algorithm) => setGreyOptions({ algorithm })}
      />
    </FilterModal>
  );
}

export default memo(ExploreGreyModal);
