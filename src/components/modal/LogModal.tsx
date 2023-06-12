import { css } from '@emotion/react';
import { CSSProperties, memo, useCallback, useMemo } from 'react';
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
import { buttons } from '../../utils/colors';

import StyledModalBody from './utils/StyledModalBody';
import StyledModalHeader from './utils/StyledModalHeader';

const modalStyle = css`
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

function getNotificationColor(level: number) {
  if (level > 40) {
    return '#ff0000';
  } else if (level === 40) {
    return '#ffc409';
  }
  return '#2dd36f';
}

function getRowColor(level: number) {
  if (level > 40) {
    return 'pink';
  } else if (level === 40) {
    return 'lightyellow';
  }
  return 'lightgreen';
}

function LogModal() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);
  const { logs, clear, unreadLevel, unreadCount, markAsRead } = useLog();
  const reversedLogs = useMemo(() => logs.slice().reverse(), [logs]);

  const handleDialogOpen = useCallback(() => {
    openDialog();
    markAsRead();
  }, [markAsRead, openDialog]);

  return (
    <>
      <Toolbar.Item
        title="Logs"
        titleOrientation="vertical"
        onClick={handleDialogOpen}
      >
        <FaBug />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '0.5em',
              left: '0.5em',
              backgroundColor: getNotificationColor(unreadLevel),
              borderRadius: '50%',
              minWidth: '14px',
              fontSize: '0.75em',
              color: 'white',
            }}
          >
            {unreadCount}
          </span>
        )}
      </Toolbar.Item>
      <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
        <div css={modalStyle}>
          <StyledModalHeader>
            <Modal.Header>Log history</Modal.Header>
          </StyledModalHeader>

          <Modal.Body>
            <StyledModalBody>
              {logs.length > 0 ? (
                <div className="table-container">
                  <Table>
                    <Table.Header>
                      <ValueRenderers.Header
                        style={tableHeaderStyle}
                        value="#"
                      />
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
                        backgroundColor: getRowColor(log.level),
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
            </StyledModalBody>
          </Modal.Body>
          <Modal.Footer>
            <Button backgroundColor={buttons.danger} onClick={clear}>
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
