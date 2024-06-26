import { Menu, MenuItem } from '@blueprintjs/core';
import { Image, ImageColorModel } from 'image-js';
import { memo, useCallback, useMemo } from 'react';
import { FaFileExport } from 'react-icons/fa';
import { Toolbar, ToolbarItemProps } from 'react-science/ui';

import useAnnotationRef from '../../hooks/useAnnotationRef';
import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import useLog from '../../hooks/useLog';
import useModal from '../../hooks/useModal';
import {
  saveAsPng,
  saveToClipboard,
  svgElementToImage,
} from '../../utils/export';

function ExportTool() {
  const currentTab = useCurrentTab();
  const { pipelined } = useImage();
  const { logger } = useLog();
  const { svgRef } = useAnnotationRef();
  const { open: openExportModal } = useModal('export');

  const exportItem: ToolbarItemProps = {
    id: 'export',
    icon: <FaFileExport />,
    tooltip: 'Export',
  };

  const exportOptions = useMemo(
    () => [
      {
        label: 'Export as png',
        data: 'png',
        type: 'option',
      },
      {
        label: 'Copy to clipboard',
        data: 'clipboard',
        type: 'option',
      },
      {
        label: 'Export as Pixelium file',
        data: 'pixelium',
        type: 'option',
      },
    ],
    [],
  );

  const content = (
    <Menu>
      {exportOptions.map((option) => (
        <MenuItem
          key={option.data}
          text={option.label}
          onClick={() => handleSelect(option)}
        />
      ))}
    </Menu>
  );

  const mergeToImage = useCallback(async () => {
    const svgElement = svgRef.current;
    const annotations = await svgElementToImage(svgElement, {
      width: pipelined.width,
      height: pipelined.height,
    });
    const recolored =
      pipelined.colorModel === ImageColorModel.RGBA
        ? (pipelined as Image)
        : pipelined.convertColor(ImageColorModel.RGBA);
    const toSave =
      annotations === null
        ? (pipelined as Image)
        : annotations.copyTo(recolored);
    return toSave;
  }, [pipelined, svgRef]);

  const exportPNG = useCallback(async () => {
    return mergeToImage().then((toSave) =>
      saveAsPng(toSave, `${currentTab || 'unnamed'}.png`),
    );
  }, [currentTab, mergeToImage]);

  const copyToClipboard = useCallback(() => {
    return mergeToImage().then((toSave) => saveToClipboard(toSave));
  }, [mergeToImage]);

  const handleSelect = useCallback(
    (selected) => {
      if (selected.data === 'png') {
        exportPNG().catch((error) =>
          logger.error(`Failed to generate PNG: ${error}`),
        );
      } else if (selected.data === 'clipboard') {
        copyToClipboard().catch((error) =>
          logger.error(`Failed to copy to clipboard: ${error}`),
        );
      } else if (selected.data === 'pixelium') {
        openExportModal();
      }
    },
    [copyToClipboard, exportPNG, logger, openExportModal],
  );

  return <Toolbar.PopoverItem content={content} itemProps={exportItem} />;
}

export default memo(ExportTool);
