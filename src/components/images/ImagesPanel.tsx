import { ImageColorModel } from 'image-js';
import { useCallback, useMemo } from 'react';
import {
  TbDroplet,
  TbDropletFilled,
  TbDropletHalfFilled,
} from 'react-icons/tb';
import { Button, Table, ValueRenderers } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useData from '../../hooks/useData';
import useDataDispatch from '../../hooks/useDataDispatch';
import useViewDispatch from '../../hooks/useViewDispatch';
import { CLOSE_IMAGE } from '../../state/data/DataActionTypes';
import { CLOSE_TAB, OPEN_TAB } from '../../state/view/ViewActionTypes';

export default function ImagesPanel() {
  const { images } = useData();
  const viewDispatch = useViewDispatch();
  const dataDispatch = useDataDispatch();

  const tabsItems = useMemo(
    () =>
      Object.keys(images).map((identifier) => ({
        id: identifier,
        title: images[identifier].metadata.name,
        width: images[identifier].image.width,
        height: images[identifier].image.height,
        bitDepth: images[identifier].image.bitDepth,
        channels: images[identifier].image.channels,
        colorModel: images[identifier].image.colorModel,
      })),
    [images],
  );

  const ColorModelIcon = (colorModelObj: { colorModel: ImageColorModel }) => {
    const { colorModel } = colorModelObj;
    switch (colorModel) {
      case 'RGB':
        return <TbDropletFilled color="#6495ED" />;
      case 'RGBA':
        return <TbDropletHalfFilled color="#6495ED" />;
      case 'GREY':
        return <TbDropletFilled color="#5F6B7C" />;
      case 'GREYA':
        return <TbDropletHalfFilled color="#5F6B7C" />;
      case 'BINARY':
        return <TbDroplet />;
      default:
    }
  };

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
        <Table compact bordered>
          <Table.Header>
            <ValueRenderers.Header value="Title" />
            <ValueRenderers.Header value="Width" />
            <ValueRenderers.Header value="Height" />
            <ValueRenderers.Header value="Bit Depth" />
            <ValueRenderers.Header value="Channels" />
            <ValueRenderers.Header value="Color Model" />
            <ValueRenderers.Header value="Close" />
          </Table.Header>
          {tabsItems.map((item) => (
            <Table.Row
              key={item.id}
              style={{
                backgroundColor: currentTab === item.id ? '#f0f0f0' : 'white',
              }}
              onClick={() => openTab(item.id)}
            >
              <ValueRenderers.Text value={item.title} />
              <ValueRenderers.Number value={item.width} />
              <ValueRenderers.Number value={item.height} />
              <ValueRenderers.Number value={item.bitDepth} />
              <ValueRenderers.Number value={item.channels} />
              <ValueRenderers.Component
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ColorModelIcon colorModel={item.colorModel} />
              </ValueRenderers.Component>
              <ValueRenderers.Component
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  minimal
                  small
                  icon="cross"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeImage(item.id);
                  }}
                />
              </ValueRenderers.Component>
            </Table.Row>
          ))}
        </Table>
      ) : null}
    </>
  );
}
