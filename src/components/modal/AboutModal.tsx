import { css } from '@emotion/react';
import { SvgLogoZakodium } from 'cheminfo-font';
import { memo } from 'react';
import { Modal, Toolbar } from 'react-science/ui';

import useModal from '../../hooks/useModal';

import StyledModalBody from './utils/StyledModalBody';
import StyledModalHeader from './utils/StyledModalHeader';

const modalStyle = css`
  display: flex;
  flex-direction: column;
  width: 500px;

  .container {
    padding: 20px;
  }
`;

function AboutModal() {
  const [isOpen, open, close] = useModal('about');

  return (
    <>
      <Toolbar.Item
        title="About Pixelium"
        titleOrientation="horizontal"
        onClick={open}
      >
        <SvgLogoZakodium />
      </Toolbar.Item>
      <Modal isOpen={isOpen} onRequestClose={close} hasCloseButton>
        <div css={modalStyle}>
          <StyledModalHeader>
            <Modal.Header>About Pixelium</Modal.Header>
          </StyledModalHeader>
          <StyledModalBody>
            <Modal.Body>Nothing to see here at this time.</Modal.Body>
          </StyledModalBody>
        </div>
      </Modal>
    </>
  );
}

export default memo(AboutModal);
