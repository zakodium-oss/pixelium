import { css } from '@emotion/react';
import { memo } from 'react';
import { FaFileExport } from 'react-icons/all';
import { Modal, Toolbar, useOnOff } from 'react-science/ui';

const modalStyle = css`
  display: flex;
  flex-direction: column;
  width: 500px;

  .header {
    font-size: 1.25rem;
  }

  .container {
    padding: 20px;
  }
`;

function ExportModal() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);

  return (
    <>
      <Toolbar.Item
        title="Export"
        titleOrientation="horizontal"
        onClick={openDialog}
      >
        <FaFileExport />
      </Toolbar.Item>
      <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
        <div css={modalStyle}>
          <Modal.Header>
            <div className="header">Export</div>
          </Modal.Header>
          <div className="container">Nothing to see here at this time.</div>
        </div>
      </Modal>
    </>
  );
}

export default memo(ExportModal);
