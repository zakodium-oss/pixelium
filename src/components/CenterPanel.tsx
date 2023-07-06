import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { DropZoneContainer, Tabs } from 'react-science/ui';

import useCurrentTab from '../hooks/useCurrentTab';
import useData from '../hooks/useData';
import useFileLoader from '../hooks/useFileLoader';
import useViewDispatch from '../hooks/useViewDispatch';

import ImageViewer from './ImageViewer';

function CenterPanel() {
  const { images } = useData();

  const tabsItems = useMemo(
    () =>
      Object.keys(images).map((identifier) => ({
        id: identifier,
        title: images[identifier].metadata.name,
        content: <ImageViewer identifier={identifier} annotable />,
      })),
    [images],
  );

  const currentTab = useCurrentTab();
  const viewDispatch = useViewDispatch();

  const openTab = useCallback(
    (identifier: string) => {
      viewDispatch({ type: 'OPEN_TAB', payload: identifier });
    },
    [viewDispatch],
  );

  useEffect(() => {
    if (!currentTab && tabsItems.length > 0) {
      openTab(tabsItems[0].id);
    }
  }, [openTab, currentTab, tabsItems]);

  const handleOnDrop = useFileLoader();

  return (
    <div style={{ width: '100%' }}>
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
    </div>
  );
}

export default memo(CenterPanel);
