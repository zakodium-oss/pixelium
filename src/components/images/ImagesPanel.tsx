import { InputGroup, Tooltip } from '@blueprintjs/core';
import { ImageColorModel } from 'image-js';
import { useCallback, useMemo, useState } from 'react';
import {
  TbDroplet,
  TbDropletFilled,
  TbDropletHalfFilled,
  TbNumber16Small,
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

  const ColorModelTooltip = (item) => {
    return (
      <Tooltip
        position="bottom"
        content={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div>Channels : {item.channels}</div>
            <div>Bit depth : {item.bitDepth}</div>
          </div>
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ColorModelIcon colorModel={item.colorModel} />
          {item.bitDepth === 16 && (
            <TbNumber16Small size={20} color="#5F6B7C" />
          )}
        </div>
      </Tooltip>
    );
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

  function editMetaData(label: string, value: string) {
    if (currentTab) {
      dataDispatch({
        type: 'EDIT_METADATA',
        payload: {
          identifier: currentTab,
          label,
          value,
        },
      });
    }
  }

  return (
    <>
      {tabsItems.length > 0 ? (
        <Table compact bordered>
          <Table.Header>
            <ValueRenderers.Header value="Title" />
            <ValueRenderers.Header value="Width" />
            <ValueRenderers.Header value="Height" />
            <ValueRenderers.Header value="Color Model" />
            <ValueRenderers.Header />
          </Table.Header>
          {tabsItems.map((item) => (
            <Table.Row
              key={item.id}
              style={{
                cursor: 'pointer',
                backgroundColor: currentTab === item.id ? '#f0f0f0' : 'white',
              }}
              onClick={() => openTab(item.id)}
            >
              <ValueRenderers.Component>
                <EditableInput
                  label="title"
                  value={item.title}
                  editMetaData={editMetaData}
                />
              </ValueRenderers.Component>
              <ValueRenderers.Number value={item.width} />
              <ValueRenderers.Number value={item.height} />
              <ValueRenderers.Component
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '4px',
                }}
              >
                <ColorModelTooltip {...item} />
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

function EditableInput({
  label,
  value,
  editMetaData,
}: {
  label: string;
  value: string;
  editMetaData: (label: string, value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  return (
    <InputGroup
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        editMetaData(label, e.target.value);
      }}
      style={{
        boxShadow: 'none',
        backgroundColor: isEditing ? 'white' : 'transparent',
      }}
      onClick={() => setIsEditing(true)}
      onBlur={() => {
        setIsEditing(false);
      }}
    />
  );
}
