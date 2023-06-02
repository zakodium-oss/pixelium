import { css } from '@emotion/react';
import { memo } from 'react';
import { FaBug } from 'react-icons/all';
import { Modal, Toolbar, useOnOff } from 'react-science/ui';

const modalStyle = css`
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 50vh;
  padding: 0.5em;

  .header {
    font-size: 1.25rem;
  }

  .container {
    padding: 20px;
  }
`;

function LogModal() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);

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
          <div className="container">Nothing to see here at this time.</div>
        </div>
      </Modal>
    </>
  );
}

export default memo(LogModal);
