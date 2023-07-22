import styled from '@emotion/styled';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { DropZoneContainer, Tabs } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useData from '../../hooks/useData';
import useFileLoader from '../../hooks/useFileLoader';
import useViewDispatch from '../../hooks/useViewDispatch';
import { OPEN_TAB } from '../../state/view/ViewActionTypes';
import ImageViewer from '../ImageViewer';

const StyledCenterPanel = styled.div`
  width: 100%;
`;

const TabTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

function CenterPanel() {
  const { images } = useData();
  const viewDispatch = useViewDispatch();

  const tabsItems = useMemo(
    () =>
      Object.keys(images).map((identifier) => ({
        id: identifier,
        title: <TabTitle>{images[identifier].metadata.name}</TabTitle>,
        content: <ImageViewer identifier={identifier} annotable />,
      })),
    [images],
  );

  const currentTab = useCurrentTab();

  const openTab = useCallback(
    (identifier: string) => {
      viewDispatch({ type: OPEN_TAB, payload: identifier });
    },
    [viewDispatch],
  );

  useEffect(() => {
    if (!currentTab && tabsItems.length > 0) {
      openTab(tabsItems[0].id);
    }
  }, [openTab, currentTab, tabsItems]);

  const { handleFileLoad: handleOnDrop } = useFileLoader();

  return (
    <StyledCenterPanel>
      <DropZoneContainer
        emptyText="Drag and drop here either an image or a Pixelium file."
        onDrop={handleOnDrop}
      >
        {tabsItems.length > 0 ? (
          <Tabs
            orientation="horizontal"
            items={tabsItems}
            opened={currentTab}
            onClick={openTab}
          />
        ) : null}
      </DropZoneContainer>
    </StyledCenterPanel>
  );
}

export default memo(CenterPanel);
