import { encodePng, readImg, writeCanvas } from 'image-js';
import { memo, useCallback, useMemo } from 'react';
import { findDOMNode } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { FaFileExport } from 'react-icons/fa';
import {
  DropdownMenu,
  MenuOption,
  MenuOptions,
  Toolbar,
} from 'react-science/ui';

import useAnnotationRef from '../../hooks/useAnnotations';
import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import createStyleElementFromCSS from '../../utils/createStyleElementFromCSS';
import ROIAnnotations from '../rois/ROIAnnotations';

function ExportTool() {
  const currentTab = useCurrentTab();
  const { pipelined } = useImage();
  const { svgRef } = useAnnotationRef();
  const exportOptions = useMemo<MenuOptions<string>>(
    () => [
      {
        label: 'Export as png',
        data: 'png',
        type: 'option',
      },
    ],
    [],
  );

  const generatePNG = useCallback(() => {
    const svgElement = svgRef.current;
    if (svgElement === null) return;

    const style = createStyleElementFromCSS();
    svgElement.insertBefore(style, svgElement.firstChild);
    const data = new XMLSerializer().serializeToString(svgElement);
    const dataBase64 = btoa(decodeURIComponent(encodeURIComponent(data)));
    const svgDataUrl = `data:image/svg+xml;base64,${dataBase64}`;

    const bbox = svgElement.getBBox();

    const nativeImage = new Image();
    nativeImage.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = bbox.width;
      canvas.height = bbox.height;

      const context = canvas.getContext('2d');
      if (context !== null) {
        context.drawImage(nativeImage, 0, 0, bbox.width, bbox.height);
        console.log(canvas.toDataURL('image/png'));
        const a = document.createElement('a');
        a.download = 'image.png';
        document.body.append(a);
        a.href = canvas.toDataURL('image/png');
        a.click();
        a.remove();
      }
    });
    nativeImage.src = svgDataUrl;
    style.remove();
  }, [svgRef]);

  const handleSelect = useCallback(
    (selected: MenuOption<string>) => {
      if (selected.data === 'png') {
        generatePNG();
      }
    },
    [generatePNG],
  );

  return (
    <DropdownMenu
      trigger="click"
      options={exportOptions}
      onSelect={handleSelect}
    >
      <Toolbar.Item title="Export" titleOrientation="horizontal">
        <FaFileExport />
      </Toolbar.Item>
    </DropdownMenu>
  );
}

export default memo(ExportTool);
