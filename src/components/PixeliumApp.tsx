import styled from '@emotion/styled';
import { memo, useRef } from 'react';
import { SplitPane, Toolbar } from 'react-science/ui';

import CenterPanel from './layout/CenterPanel';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import ModalContainer from './modal/ModalContainer';
import ExportTool from './tool/ExportTool';
import GreyTool from './tool/FilterTool';
import GeometryTool from './tool/GeometryTool';
import ImportTool from './tool/ImportTool';
import MaskTool from './tool/MaskTool';
import MorphologyTool from './tool/MorphologyTool';
import ROITool from './tool/ROITool';

const PixeliumStyle = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const PixeliumMainStyle = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
`;

function PixeliumApp() {
  // Refs
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <PixeliumStyle ref={rootRef}>
      <Header />
      <PixeliumMainStyle>
        <Toolbar vertical>
          <ImportTool />
          <ExportTool />
          <GreyTool />
          <MaskTool />
          <MorphologyTool />
          <GeometryTool />
          <ROITool />
          <ModalContainer />
        </Toolbar>
        <SplitPane direction="horizontal" size="300px" controlledSide="end">
          <CenterPanel />
          <Sidebar />
        </SplitPane>
      </PixeliumMainStyle>
    </PixeliumStyle>
  );
}

export default memo(PixeliumApp);
