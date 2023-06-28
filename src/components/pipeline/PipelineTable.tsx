import styled from '@emotion/styled';
import { memo, useCallback } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
  Button,
  Checkbox,
  CheckedState,
  Table,
  ValueRenderers,
} from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useData from '../../hooks/useData';
import useDataDispatch from '../../hooks/useDataDispatch';
import useViewDispatch from '../../hooks/useViewDispatch';
import {
  REMOVE_PIPELINE_OPERATION,
  TOGGLE_PIPELINE_OPERATION,
} from '../../state/data/DataActionTypes';
import {
  OPEN_MODAL,
  SET_EDIT_MODE_IDENTIFIER,
} from '../../state/view/ViewActionTypes';
import { getModalNameFromOperationType } from '../../state/view/ViewReducer';
import { buttons } from '../../utils/colors';

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 0.25rem;
`;

interface PipelineTableProps {
  identifier: string;
}

function PipelineTable({ identifier }: PipelineTableProps) {
  const data = useData();
  const dataDispatch = useDataDispatch();
  const viewDispatch = useViewDispatch();
  const currentTab = useCurrentTab();

  const handleDelete = useCallback(
    (opIdentifier: string) => {
      dataDispatch({
        type: REMOVE_PIPELINE_OPERATION,
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
    (opIdentifier: string, checked: CheckedState) => {
      dataDispatch({
        type: TOGGLE_PIPELINE_OPERATION,
        payload: {
          identifier,
          opIdentifier,
          checked: checked === 'indeterminate' ? true : checked,
        },
      });
    },
    [dataDispatch, identifier],
  );

  return (
    <Table>
      <Table.Header>
        <ValueRenderers.Title value="#" />
        <ValueRenderers.Title value="Type" />
        <ValueRenderers.Title value="Options" />
        <ValueRenderers.Title value="Enabled" />
        <ValueRenderers.Title value="Actions" />
      </Table.Header>
      {data.images[identifier].pipeline.map((operation, index) => (
        <Table.Row key={operation.identifier}>
          <ValueRenderers.Number value={index + 1} />
          <ValueRenderers.Text
            value={operation.type}
            style={{ cursor: 'pointer' }}
          />
          {'options' in operation ? (
            <ValueRenderers.Object value={operation.options} />
          ) : (
            <ValueRenderers.Text value="N/A" />
          )}
          <ValueRenderers.Component>
            <Checkbox
              checked={operation.isActive}
              onChange={(checked) =>
                handleToggle(operation.identifier, checked)
              }
            />
          </ValueRenderers.Component>
          <ValueRenderers.Component>
            <ActionsContainer>
              <Button
                backgroundColor={buttons.info}
                onClick={() => handleEdit(operation.identifier)}
              >
                <FaEdit />
              </Button>
              <Button
                backgroundColor={buttons.danger}
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
