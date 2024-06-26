import { Roi } from 'image-js';
import startCase from 'lodash/startCase';
import { memo, useCallback, useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import { Toolbar, PanelHeader } from 'react-science/ui';
import { useCopyToClipboard } from 'react-use';

import useOriginalFilteredROIs from '../../hooks/useOriginalFilteredROIs';
import useROIs from '../../hooks/useROIs';
import useViewDispatch from '../../hooks/useViewDispatch';
import { availableRoiColumns } from '../../state/preferences/PreferencesReducer';
import { SET_EDIT_ROI_PREFERENCE } from '../../state/view/ViewActionTypes';
import useROIContext, { useROIDispatch } from '../context/ROIContext';

interface ROIToolbarProps {
  identifier: string;
}

function roisToTSV(rois: Roi[]) {
  const headers = [availableRoiColumns.map(startCase).join('\t')];
  return headers
    .concat(
      rois.map((roi) => {
        return [
          roi.id,
          roi.width,
          roi.height,
          roi.surface,
          roi.feret.aspectRatio.toFixed(2),
          roi.feret.minDiameter.length.toFixed(2),
          roi.feret.maxDiameter.length.toFixed(2),
          roi.roundness.toFixed(2),
          roi.solidity.toFixed(2),
          roi.sphericity.toFixed(2),
          roi.fillRatio.toFixed(2),
        ].join('\t');
      }),
    )
    .map((line) => `${line}\n`)
    .join('');
}

const copyToClipBoardDefaultText = 'Copy to clipboard';

function ROIToolbar({ identifier }: ROIToolbarProps) {
  const rois = useROIs(identifier);
  const originalFilteredROIs = useOriginalFilteredROIs(identifier);
  const viewDispatch = useViewDispatch();

  const [copyToClipBoardText, setCopyToClipBoardText] = useState(
    copyToClipBoardDefaultText,
  );

  const [, copyToClipboard] = useCopyToClipboard();

  const handleCopyToClipboard = useCallback(() => {
    copyToClipboard(roisToTSV(originalFilteredROIs));
    setCopyToClipBoardText('Copied!');
    setTimeout(() => {
      setCopyToClipBoardText(copyToClipBoardDefaultText);
    }, 1000);
  }, [copyToClipboard, originalFilteredROIs]);

  const handleEditROIPreference = useCallback(() => {
    viewDispatch({ type: SET_EDIT_ROI_PREFERENCE, payload: true });
  }, [viewDispatch]);

  const roiDispatch = useROIDispatch();
  const { filters } = useROIContext();

  function resetFilters() {
    for (const filter of filters) {
      roiDispatch({
        type: 'REMOVE_FILTER',
        payload: { column: filter.column },
      });
    }
  }

  const hasFilters = filters.length > 0;

  return (
    <PanelHeader
      current={originalFilteredROIs.length}
      total={rois.length}
      onClickSettings={handleEditROIPreference}
    >
      {rois.length > 0 && (
        <Toolbar>
          <Toolbar.Item
            tooltip={copyToClipBoardText}
            icon={<FaCopy />}
            onClick={handleCopyToClipboard}
          />
          <Toolbar.Item
            tooltip="Reset filters"
            disabled={!hasFilters}
            icon={<MdFilterAltOff size={20} />}
            onClick={resetFilters}
          />
        </Toolbar>
      )}
    </PanelHeader>
  );
}

export default memo(ROIToolbar);
