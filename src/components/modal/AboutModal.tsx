import styled from '@emotion/styled';
import { memo } from 'react';
import { Modal } from 'react-science/ui';

import useModal from '../../hooks/useModal';

import StyledModalBody from './utils/StyledModalBody';
import StyledModalHeader from './utils/StyledModalHeader';

const AboutModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;

  .container {
    padding: 20px;
  }
`;

function AboutModal() {
  const { isOpen, close } = useModal('about');

  return (
    <Modal isOpen={isOpen} onRequestClose={close} hasCloseButton>
      <AboutModalStyle>
        <StyledModalHeader>
          <Modal.Header>About Pixelium</Modal.Header>
        </StyledModalHeader>
        <StyledModalBody>
          <Modal.Body>Nothing to see here at this time.</Modal.Body>
        </StyledModalBody>
      </AboutModalStyle>
    </Modal>
  );
}

export default memo(AboutModal);
