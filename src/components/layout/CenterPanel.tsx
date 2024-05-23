/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { memo } from 'react';
import { DropZoneContainer } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useFileLoader from '../../hooks/useFileLoader';
import ImageViewer from '../ImageViewer';

const StyledCenterPanel = styled.div`
  width: 100%;
`;

function CenterPanel() {
  const currentTab = useCurrentTab();

  const { handleFileLoad: handleOnDrop } = useFileLoader();

  return (
    <StyledCenterPanel>
      <DropZoneContainer
        emptyDescription="Drag and drop here either an image or a Pixelium file."
        onDrop={handleOnDrop}
      >
        {currentTab ? (
          <ImageViewer key={currentTab} identifier={currentTab} annotable />
        ) : null}
      </DropZoneContainer>
    </StyledCenterPanel>
  );
}

export default memo(CenterPanel);
