import styled from '@emotion/styled';
import { memo, useCallback } from 'react';
import { FaArrowDown, FaArrowUp, FaTrash } from 'react-icons/fa';
import { Button, Table, ValueRenderers } from 'react-science/ui';

import useData from '../../hooks/useData';
import useDataDispatch from '../../hooks/useDataDispatch';
import {
  MOVE_PIPELINE_OPERATION_DOWN,
  MOVE_PIPELINE_OPERATION_UP,
  REMOVE_PIPELINE_OPERATION,
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

  const handleMoveUp = useCallback(
    (opIdentifier: string) => {
      dataDispatch({
        type: MOVE_PIPELINE_OPERATION_UP,
        payload: {
          identifier,
          opIdentifier,
        },
      });
    },
    [dataDispatch, identifier],
  );

  const handleMoveDown = useCallback(
    (opIdentifier: string) => {
      dataDispatch({
        type: MOVE_PIPELINE_OPERATION_DOWN,
        payload: {
          identifier,
          opIdentifier,
        },
      });
    },
    [dataDispatch, identifier],
  );

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

  const canMoveUp = useCallback(
    (opIdentifier: string) => {
      const identifiedOperation = data.images[identifier].pipeline.find(
        (operation) => operation.identifier === opIdentifier,
      );

      if (!identifiedOperation) return false;
      return data.images[identifier].pipeline.some(
        (operation) => operation.order === identifiedOperation.order - 1,
      );
    },
    [data.images, identifier],
  );

  const canMoveDown = useCallback(
    (opIdentifier: string) => {
      const identifiedOperation = data.images[identifier].pipeline.find(
        (operation) => operation.identifier === opIdentifier,
      );

      if (!identifiedOperation) return false;
      return data.images[identifier].pipeline.some(
        (operation) => operation.order === identifiedOperation.order + 1,
      );
    },
    [data.images, identifier],
  );

  return (
    <Table>
      <Table.Header>
        <ValueRenderers.Title value="#" />
        <ValueRenderers.Title value="Type" />
        <ValueRenderers.Title value="Options" />
        <ValueRenderers.Title value="Actions" />
      </Table.Header>
      {data.images[identifier].pipeline.map((operation) => (
        <Table.Row key={operation.identifier}>
          <ValueRenderers.Number value={operation.order} />
          <ValueRenderers.Text value={operation.type} />
          <ValueRenderers.Object value={operation.options} />
          <ValueRenderers.Component>
            <ActionsContainer>
              <Button
                onClick={() => handleMoveUp(operation.identifier)}
                backgroundColor={buttons.info}
                disabled={!canMoveUp(operation.identifier)}
              >
                <FaArrowUp />
              </Button>
              <Button
                onClick={() => handleMoveDown(operation.identifier)}
                backgroundColor={buttons.info}
                disabled={!canMoveDown(operation.identifier)}
              >
                <FaArrowDown />
              </Button>
              <Button
                onClick={() => handleDelete(operation.identifier)}
                backgroundColor={buttons.danger}
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
