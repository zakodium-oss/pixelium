import { Mask, ThresholdAlgorithm, ThresholdOptionsAlgorithm } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_MASK } from '../../../../state/data/DataActionTypes';
import FastSelector from '../../../FastSelector';
import PreviewModal from '../PreviewModal';

interface ExportMaskModalProps {
  previewImageIdentifier: string;
}

function ExploreMaskModal({ previewImageIdentifier }: ExportMaskModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<ThresholdOptionsAlgorithm>({
      algorithm: ThresholdAlgorithm.HUANG,
      slots: 2 ** 8,
    });

  const { pipelined } = useImage(opIdentifier);

  const [maskOptions, setMaskOptions] =
    useState<ThresholdOptionsAlgorithm>(defaultOptions);

  const [algoError, setAlgoError] = useState<string>();
  const maskImage = useMemo(() => {
    setAlgoError(undefined);
    if (pipelined instanceof Mask) {
      return pipelined;
    }

    try {
      return pipelined.threshold(maskOptions);
    } catch (error: any) {
      setAlgoError(error.message);
      return null;
    }
  }, [pipelined, maskOptions]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('mask');

  const addMask = useCallback(() => {
    dataDispatch({
      type: SET_MASK,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: maskOptions,
      },
    });
    close();
  }, [dataDispatch, previewImageIdentifier, opIdentifier, maskOptions, close]);

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Explore mask"
      viewIdentifier="__mask_preview"
      apply={addMask}
      original={pipelined}
      preview={maskImage}
      editing={editing}
      algoError={algoError}
    >
      <FastSelector
        options={Object.values(ThresholdAlgorithm)}
        selected={maskOptions.algorithm}
        setSelected={(algorithm) =>
          setMaskOptions({ ...maskOptions, algorithm })
        }
      />
    </PreviewModal>
  );
}

export default memo(ExploreMaskModal);
