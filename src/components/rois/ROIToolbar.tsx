import styled from '@emotion/styled';
import { Roi } from 'image-js';
import startCase from 'lodash/startCase';
import { memo, useCallback, useState } from 'react';
import { FaCog, FaCopy } from 'react-icons/fa';
import { Toolbar } from 'react-science/ui';
import { useCopyToClipboard } from 'react-use';

import useROIs from '../../hooks/useROIs';
import useViewDispatch from '../../hooks/useViewDispatch';
import { availableRoiColumns } from '../../state/preferences/PreferencesReducer';
import { SET_EDIT_ROI_PREFERENCE } from '../../state/view/ViewActionTypes';

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

const Separator = styled.div`
  flex: 1;
`;

const ROICount = styled.div`
  display: flex;
  align-items: center;
`;

function ROIToolbar({ identifier }: ROIToolbarProps) {
  const rois = useROIs(identifier);
  const viewDispatch = useViewDispatch();

  const [copyToClipBoardText, setCopyToClipBoardText] = useState(
    copyToClipBoardDefaultText,
  );

  const [, copyToClipboard] = useCopyToClipboard();

  const handleCopyToClipboard = useCallback(() => {
    copyToClipboard(roisToTSV(rois));
    setCopyToClipBoardText('Copied!');
    setTimeout(() => {
      setCopyToClipBoardText(copyToClipBoardDefaultText);
    }, 1000);
  }, [copyToClipboard, rois]);

  const handleEditROIPreference = useCallback(() => {
    viewDispatch({ type: SET_EDIT_ROI_PREFERENCE, payload: true });
  }, [viewDispatch]);

  return (
    <Toolbar orientation="horizontal">
      {rois.length > 0 && (
        <Toolbar.Item
          title={copyToClipBoardText}
          titleOrientation="horizontal"
          onClick={handleCopyToClipboard}
        >
          <FaCopy />
        </Toolbar.Item>
      )}
      <Separator />
      <ROICount>{`[${rois.length}]`}</ROICount>
      <Toolbar.Item
        title="ROI preferences"
        titleOrientation="auto"
        onClick={handleEditROIPreference}
      >
        <FaCog />
      </Toolbar.Item>
    </Toolbar>
  );
}

export default memo(ROIToolbar);
