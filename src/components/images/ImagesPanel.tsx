import styled from '@emotion/styled';
import { useCallback, useMemo } from 'react';
import { Toolbar } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useData from '../../hooks/useData';
import useViewDispatch from '../../hooks/useViewDispatch';
import { OPEN_TAB } from '../../state/view/ViewActionTypes';
import CloseTool from '../tool/CloseTool';

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
              <Toolbar>
                <CloseTool closeId={item.id} />
              </Toolbar>
            </TabItem>
          ))}
        </div>
      ) : null}
    </>
  );
}
