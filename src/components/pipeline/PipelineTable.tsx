import styled from '@emotion/styled';
import { memo, useCallback } from 'react';
import { FaTrash } from 'react-icons/fa';
import {
  Button,
  Checkbox,
  CheckedState,
  Table,
  ValueRenderers,
} from 'react-science/ui';

import useData from '../../hooks/useData';
import useDataDispatch from '../../hooks/useDataDispatch';
import {
  REMOVE_PIPELINE_OPERATION,
  TOGGLE_PIPELINE_OPERATION,
} from '../../state/data/DataActionTypes';
import { buttons } from '../../utils/colors';

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

interface PipelineTableProps {
  identifier: string;
}

function PipelineTable({ identifier }: PipelineTableProps) {
  const data = useData();
  const dataDispatch = useDataDispatch();

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
