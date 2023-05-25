import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { DropZoneContainer, Tabs } from 'react-science/ui';

import useData from '../hooks/useData';
import useFileLoader from '../hooks/useFileLoader';
import useView from '../hooks/useView';
import useViewDispatch from '../hooks/useViewDispatch';

import ImageViewer from './ImageViewer';

function CenterPanel() {
  const { files } = useData();

  const tabsItems = useMemo(
    () =>
      Object.keys(files).map((identifier) => ({
        id: identifier,
        title: files[identifier].metadata.name,
        content: <ImageViewer identifier={identifier} />,
      })),
    [files],
  );

  const { currentTab } = useView();
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
  );
}

export default memo(CenterPanel);
