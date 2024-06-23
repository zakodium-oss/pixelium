import { Menu, MenuItem } from '@blueprintjs/core';
import { Image, ImageColorModel } from 'image-js';
import { memo, useCallback, useMemo } from 'react';
import { FaFileExport } from 'react-icons/fa';
import { Toolbar, ToolbarItemProps } from 'react-science/ui';

import useAnnotationRef from '../../hooks/useAnnotationRef';
import useImage from '../../hooks/useImage';
import useModal from '../../hooks/useModal';
import { svgElementToImage } from '../../utils/export';

export function useMergeToImage(hasAnnotations: boolean) {
  const { pipelined } = useImage();
  const { svgRef } = useAnnotationRef();

  return async () => {
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
      annotations === null || !hasAnnotations
        ? (pipelined as Image)
        : annotations.copyTo(recolored);
    return { toSave, annotations };
  };
}

function ExportTool() {
  const { open: openExportPngModal } = useModal('exportPng');
  const { open: openExportClipboardModal } = useModal('exportClipboard');
  const { open: openExportPixeliumModal } = useModal('exportPixelium');

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

  const handleSelect = useCallback(
    (selected) => {
      if (selected.data === 'png') {
        openExportPngModal();
      } else if (selected.data === 'clipboard') {
        openExportClipboardModal();
      } else if (selected.data === 'pixelium') {
        openExportPixeliumModal();
      }
    },
    [openExportPngModal, openExportClipboardModal, openExportPixeliumModal],
  );

  return <Toolbar.PopoverItem content={content} itemProps={exportItem} />;
}

export default memo(ExportTool);
