import styled from '@emotion/styled';
import { useCallback, useMemo } from 'react';
import { Button } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useData from '../../hooks/useData';
import useDataDispatch from '../../hooks/useDataDispatch';
import useViewDispatch from '../../hooks/useViewDispatch';
import { CLOSE_IMAGE } from '../../state/data/DataActionTypes';
import { CLOSE_TAB, OPEN_TAB } from '../../state/view/ViewActionTypes';

const TabTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const TabItem = styled.div<{ current: boolean }>`
  cursor: default;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  &:hover {
    background-color: #f0f0f0;
  }
  background-color: ${(props) => (props.current ? '#f0f0f0' : 'white')};
`;

export default function ImagesPanel() {
  const { images } = useData();
  const viewDispatch = useViewDispatch();
  const dataDispatch = useDataDispatch();

  const tabsItems = useMemo(
    () =>
      Object.keys(images).map((identifier) => ({
        id: identifier,
        title: <TabTitle>{images[identifier].metadata.name}</TabTitle>,
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

  const closeImage = useCallback(
    (closeId: string) => {
      dataDispatch({ type: CLOSE_IMAGE, payload: closeId });
      if (tabsItems.length === 1) {
        viewDispatch({ type: CLOSE_TAB });
      } else if (currentTab === closeId) {
        const lastTab = tabsItems.at(-1)?.id;
        const id = lastTab === currentTab ? tabsItems.at(-2)?.id : lastTab;
        if (id) viewDispatch({ type: OPEN_TAB, payload: id });
      }
    },
    [dataDispatch, tabsItems, currentTab, viewDispatch],
  );

  return (
    <>
      {tabsItems.length > 0 ? (
        <div>
          {tabsItems.map((item) => (
            <TabItem
              key={item.id}
              current={currentTab === item.id}
              onClick={() => openTab(item.id)}
            >
              {item.title}
              <Button
                minimal
                icon="cross"
                onClick={(e) => {
                  e.stopPropagation();
                  closeImage(item.id);
                }}
              />
            </TabItem>
          ))}
        </div>
      ) : null}
    </>
  );
}
