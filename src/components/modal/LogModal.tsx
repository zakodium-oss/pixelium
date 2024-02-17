import { Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { CSSProperties, memo, useMemo } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Button, Table, ValueRenderers } from 'react-science/ui';

import useLog from '../../hooks/useLog';
import useModal from '../../hooks/useModal';
import { getRowColor } from '../../utils/colors';

import StyledModalBody from './utils/StyledModalBody';

const LogModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 50vh;

  .table-container {
    width: 100%;
    max-width: 100%;
    overflow-y: auto;
  }

  table {
    width: 100%;
  }

  .no-log {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
  }
`;

const tableHeaderStyle: CSSProperties = {
  textAlign: 'left',
};

const logsDataFormat = new Intl.DateTimeFormat('default', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

function LogModal() {
  const { isOpen, close } = useModal('log');
  const { logs, clear } = useLog();
  const reversedLogs = useMemo(() => logs.slice().reverse(), [logs]);

  return (
    <Dialog
      title="Log history"
      isOpen={isOpen}
      onClose={close}
      style={{ width: 'fit-content' }}
    >
      <LogModalStyle>
        <DialogBody>
          <StyledModalBody>
            {logs.length > 0 ? (
              <div className="table-container">
                <Table>
                  <Table.Header>
                    <ValueRenderers.Header style={tableHeaderStyle} value="#" />
                    <ValueRenderers.Header
                      style={tableHeaderStyle}
                      value="Time"
                    />
                    <ValueRenderers.Header
                      style={tableHeaderStyle}
                      value="Label"
                    />
                    <ValueRenderers.Header
                      style={tableHeaderStyle}
                      value="Message"
                    />
                  </Table.Header>
                  {reversedLogs.map((log) => {
                    const rowStyle: CSSProperties = {
                      backgroundColor: getRowColor(log.level),
                    };
                    return (
                      <Table.Row key={log.id} style={rowStyle}>
                        <ValueRenderers.Number value={log.id} />
                        <ValueRenderers.Text
                          value={logsDataFormat.format(log.time)}
                        />
                        <ValueRenderers.Text value={log.levelLabel} />
                        <ValueRenderers.Text value={log.message} />
                      </Table.Row>
                    );
                  })}
                </Table>
              </div>
            ) : (
              <div className="no-log">Nothing to see for now.</div>
            )}
          </StyledModalBody>
        </DialogBody>
        <DialogFooter
          minimal
          actions={
            <Button icon={<FaTrash />} intent="danger" onClick={clear}>
              Clear logs
            </Button>
          }
        />
      </LogModalStyle>
    </Dialog>
  );
}

export default memo(LogModal);
