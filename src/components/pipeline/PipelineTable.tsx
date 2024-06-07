import { Checkbox, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import styled from '@emotion/styled';
import {
  CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Table, ValueRenderers } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useData from '../../hooks/useData';
import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import useViewDispatch from '../../hooks/useViewDispatch';
import {
  COPY_OPERATIONS,
  REMOVE_OPERATION,
  TOGGLE_OPERATION,
} from '../../state/data/DataActionTypes';
import {
  OPEN_MODAL,
  SET_EDIT_MODE_IDENTIFIER,
} from '../../state/view/ViewActionTypes';
import { getModalNameFromOperationType } from '../../state/view/ViewReducer';

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 0.25rem;
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-inline: 50px;
`;

const pointerStyle: CSSProperties = { cursor: 'pointer' };

interface PipelineTableProps {
  identifier: string;
}

function PipelineTable({ identifier }: PipelineTableProps) {
  const data = useData();
  const { times } = useImage();
  const dataDispatch = useDataDispatch();
  const viewDispatch = useViewDispatch();
  const currentTab = useCurrentTab();

  const handleDelete = useCallback(
    (opIdentifier: string) => {
      dataDispatch({
        type: REMOVE_OPERATION,
        payload: {
          identifier,
          opIdentifier,
        },
      });
    },
    [dataDispatch, identifier],
  );

  const handleEdit = useCallback(
    (opIdentifier: string) => {
      const operation = data.images[identifier].pipeline.find(
        (operation) => operation.identifier === opIdentifier,
      );
      if (!operation) return;

      viewDispatch({
        type: SET_EDIT_MODE_IDENTIFIER,
        payload:
          currentTab === undefined
            ? null
            : { identifier: currentTab, opIdentifier },
      });

      viewDispatch({
        type: OPEN_MODAL,
        payload: getModalNameFromOperationType(operation.type),
      });
    },
    [currentTab, data.images, identifier, viewDispatch],
  );

  const handleToggle = useCallback(
    (opIdentifier, checked) => {
      dataDispatch({
        type: TOGGLE_OPERATION,
        payload: {
          identifier,
          opIdentifier,
          checked: checked === 'indeterminate' ? true : checked,
        },
      });
    },
    [dataDispatch, identifier],
  );

  const pipeline = useMemo(
    () => data.images[identifier]?.pipeline ?? [],
    [data, identifier],
  );

  const otherImagesOptions = useMemo(
    () =>
      Object.keys(data.images)
        .filter((key) => data.images[key].pipeline.length > 0)
        .map((imageKey) => ({
          label: data.images[imageKey].metadata.name,
          value: imageKey,
        })),
    [data.images],
  );

  const [imageKeyToImport, setImageKeyToImport] = useState<string>();

  useEffect(() => {
    if (imageKeyToImport === undefined) return;
    dataDispatch({
      type: COPY_OPERATIONS,
      payload: {
        fromIdentifier: imageKeyToImport,
        toIdentifier: identifier,
      },
    });
    setImageKeyToImport(undefined);
  }, [dataDispatch, identifier, imageKeyToImport]);

  if (pipeline.length === 0) {
    return (
      <Empty>
        <p>Pipeline is empty.</p>
        <p>Import from another image:</p>
        <Select
          filterable={false}
          activeItem={otherImagesOptions.find(
            (option) => option.value === imageKeyToImport,
          )}
          items={otherImagesOptions}
          itemRenderer={(item, { handleClick, modifiers }) =>
            item ? (
              <MenuItem
                key={item.value}
                text={item.label}
                onClick={handleClick}
                active={modifiers.active}
                disabled={modifiers.disabled}
              />
            ) : null
          }
          onItemSelect={(item) => {
            setImageKeyToImport(item.value);
          }}
        >
          <Button text="Select" rightIcon="double-caret-vertical" />
        </Select>
      </Empty>
    );
  }
  return (
    <Table>
      <Table.Header>
        <ValueRenderers.Header value="#" />
        <ValueRenderers.Header value="Type" />
        <ValueRenderers.Header value="Options" />
        <ValueRenderers.Header value="Enabled" />
        <ValueRenderers.Header value="Time (ms)" />
        <ValueRenderers.Header value="Actions" />
      </Table.Header>
      {pipeline.map((operation, index) => (
        <Table.Row key={operation.identifier}>
          <ValueRenderers.Number value={index + 1} />
          <ValueRenderers.Text value={operation.type} style={pointerStyle} />
          {'options' in operation ? (
            <ValueRenderers.Component
              style={{
                maxWidth: '100px',
                overflowX: 'auto',
              }}
            >
              <ValueRenderers.Object value={operation.options} />
            </ValueRenderers.Component>
          ) : (
            <ValueRenderers.Text value="N/A" />
          )}
          <ValueRenderers.Component>
            <Checkbox
              checked={operation.isActive}
              onChange={(e) =>
                handleToggle(operation.identifier, e.target.checked)
              }
            />
          </ValueRenderers.Component>
          <ValueRenderers.Number
            value={
              times.find(
                ({ identifier }) => identifier === operation.identifier,
              )?.time ?? 0
            }
            fixed={2}
          />
          <ValueRenderers.Component>
            <ActionsContainer>
              <Button
                intent="primary"
                onClick={() => handleEdit(operation.identifier)}
              >
                <FaEdit />
              </Button>
              <Button
                intent="danger"
                onClick={() => handleDelete(operation.identifier)}
              >
                <FaTrash />
              </Button>
            </ActionsContainer>
          </ValueRenderers.Component>
        </Table.Row>
      ))}
    </Table>
  );
}

export default memo(PipelineTable);
