import { css } from '@emotion/react';
import { SvgLogoZakodium } from 'cheminfo-font';
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

export default function AboutModal() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);

  return (
    <>
      <Toolbar.Item
        title="About Pixelium"
        titleOrientation="horizontal"
        onClick={openDialog}
      >
        <SvgLogoZakodium />
      </Toolbar.Item>
      <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
        <div css={modalStyle}>
          <Modal.Header>
            <div className="header">About Pixelium</div>
          </Modal.Header>
          <div className="container">Nothing to see here at this time.</div>
        </div>
      </Modal>
    </>
  );
}
