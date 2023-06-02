import { css } from '@emotion/react';
import { CSSProperties, memo, useMemo } from 'react';
import { FaBug, FaTrash } from 'react-icons/all';
import {
  Button,
  Modal,
  Table,
  Toolbar,
  useOnOff,
  ValueRenderers,
} from 'react-science/ui';

import useLog from '../../hooks/useLog';

const modalStyle = css`
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 50vh;
  padding: 0.5em;

  .header {
    font-size: 1.25rem;
  }

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

const logLevelColorMap = {
  trace: '#ffffff',
  debug: '#ffffff',
  info: '#ffffff',
  warn: '#fffbe6',
  error: '#ffe6e6',
  fatal: '#ffe6e6',
};

const logsDataFormat = new Intl.DateTimeFormat('default', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

function LogModal() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);
  const { logs, clear } = useLog();
  const reversedLogs = useMemo(() => logs.slice().reverse(), [logs]);

  return (
    <>
      <Toolbar.Item
        title="Logs"
        titleOrientation="vertical"
        onClick={openDialog}
      >
        <FaBug />
      </Toolbar.Item>
      <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
        <div css={modalStyle}>
          <Modal.Header>
            <div className="header">Log history</div>
          </Modal.Header>
          <Modal.Body>
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
                    const cellStyle: CSSProperties = {
                      backgroundColor: logLevelColorMap[log.levelLabel],
                    };
                    return (
                      <Table.Row key={log.id}>
                        <ValueRenderers.Number
                          style={cellStyle}
                          value={log.id}
                        />
                        <ValueRenderers.Text
                          style={cellStyle}
                          value={logsDataFormat.format(log.time)}
                        />
                        <ValueRenderers.Text
                          style={cellStyle}
                          value={log.levelLabel}
                        />
                        <ValueRenderers.Text
                          style={cellStyle}
                          value={log.message}
                        />
                      </Table.Row>
                    );
                  })}
                </Table>
              </div>
            ) : (
              <div className="no-log">Nothing to see for now.</div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              backgroundColor={{ basic: '#c81e1e', hover: '#971d1f' }}
              onClick={clear}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaTrash />
                <span style={{ marginLeft: '8px' }}>Clear logs</span>
              </span>
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}

export default memo(LogModal);
