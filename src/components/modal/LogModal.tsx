import { css } from '@emotion/react';
import { CSSProperties, memo, useCallback, useMemo } from 'react';
import { FaBug } from 'react-icons/all';
import {
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

  const { logger, logs } = useLog();

  const onClick = useCallback(() => {
    logger.warn('test');
  }, [logger]);

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
                      <ValueRenderers.Number style={cellStyle} value={log.id} />
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
          </Modal.Body>
          <Modal.Footer>
            <button type="button" onClick={onClick}>
              Add log
            </button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}

export default memo(LogModal);
