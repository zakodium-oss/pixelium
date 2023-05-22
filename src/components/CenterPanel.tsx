import React, { memo, useCallback, useMemo } from 'react';
import { Tabs } from 'react-science/ui';

import useData from '../hooks/useData';
import useView from '../hooks/useView';
import useViewDispatch from '../hooks/useViewDispatch';

import DropZone from './dropzone/DropZone';

function CenterPanel() {
  const { files } = useData();

  const tabsItems = useMemo(
    () =>
      Object.keys(files).map((identifier) => ({
        id: identifier,
        title: files[identifier].metadata.name,
        content: files[identifier].metadata.name,
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

  return (
    <DropZone>
      <Tabs
        orientation="horizontal"
        items={tabsItems}
        opened={currentTab}
        onClick={openTab}
      />
    </DropZone>
  );
}

export default memo(CenterPanel);
