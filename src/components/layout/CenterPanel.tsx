/** @jsxImportSource @emotion/react */
import { Tabs, Tab } from '@blueprintjs/core';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { DropZoneContainer } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useData from '../../hooks/useData';
import useFileLoader from '../../hooks/useFileLoader';
import useViewDispatch from '../../hooks/useViewDispatch';
import { OPEN_TAB } from '../../state/view/ViewActionTypes';
import ImageViewer from '../ImageViewer';

const StyledCenterPanel = styled.div`
  width: 100%;
`;

function CenterPanel() {
  const { images } = useData();
  const viewDispatch = useViewDispatch();

  const tabsItems = useMemo(
    () =>
      Object.keys(images).map((identifier) => ({
        id: identifier,
        content: (
          <ImageViewer key={identifier} identifier={identifier} annotable />
        ),
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
    if (tabsItems.length > 0) {
      const defaultTab = tabsItems.at(-1);
      if (defaultTab) openTab(defaultTab.id);
    }
  }, [openTab, tabsItems]);

  const { handleFileLoad: handleOnDrop } = useFileLoader();

  return (
    <StyledCenterPanel>
      <DropZoneContainer
        emptyDescription="Drag and drop here either an image or a Pixelium file."
        onDrop={handleOnDrop}
      >
        {tabsItems.length > 0 ? (
          <Tabs
            selectedTabId={currentTab}
            onChange={openTab}
            css={css`
              height: 100%;
              div[role='tabpanel'] {
                height: 100%;
                margin-top: 0;
              }
            `}
          >
            {tabsItems.map((item) => (
              <Tab id={item.id} key={item.id} panel={item.content} />
            ))}
          </Tabs>
        ) : null}
      </DropZoneContainer>
    </StyledCenterPanel>
  );
}

export default memo(CenterPanel);
