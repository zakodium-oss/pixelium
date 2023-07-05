import styled from '@emotion/styled';
import { Roi } from 'image-js';
import { memo, useCallback, useState } from 'react';
import { FaCogs, FaCopy } from 'react-icons/fa';
import { Toolbar } from 'react-science/ui';
import { useCopyToClipboard } from 'react-use';

import useRois from '../../hooks/useRois';

const RightAligned = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

interface ROIToolbarProps {
  identifier: string;
}

function roisToTSV(rois: Roi[]) {
  return rois
    .map((roi) => {
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
    })
    .map((line) => `${line}\n`)
    .join('');
}

const copyToClipBoardDefaultText = 'Copy to clipboard';

function ROIToolbar({ identifier }: ROIToolbarProps) {
  const rois = useRois(identifier);

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

  return (
    <RightAligned>
      <Toolbar orientation="horizontal">
        <Toolbar.Item title="ROI preferences" titleOrientation="horizontal">
          <FaCogs />
        </Toolbar.Item>
        <Toolbar.Item
          title={copyToClipBoardText}
          titleOrientation="horizontal"
          onClick={handleCopyToClipboard}
        >
          <FaCopy />
        </Toolbar.Item>
      </Toolbar>
    </RightAligned>
  );
}

export default memo(ROIToolbar);
