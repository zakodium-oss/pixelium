import styled from '@emotion/styled';
import { memo } from 'react';
import { FaFileSignature, FaGithub } from 'react-icons/fa';
import { Modal } from 'react-science/ui';

import hearcLogo from '../../assets/hearc-logo.png';
import zakodiumLogo from '../../assets/zakodium-logo.png';
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

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    margin-bottom: 10px;
    font-size: 1.5rem;
    font-weight: bold;
  }

  p {
    margin-bottom: 10px;
    font-size: 1rem;
    text-align: center;
  }
`;

const ImageColumns = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;

  a {
    width: 50%;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  font-size: 1rem;

  a {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    &:hover {
      text-decoration: underline;
    }

    svg {
      margin-right: 5px;
    }
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
          <Modal.Body>
            <AboutContent>
              <h2>Pixelium</h2>
              <p>
                Pixelium is a React component for displaying and processing
                raster images.
              </p>
              <ImageColumns>
                <a
                  href="https://zakodium.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={zakodiumLogo} />
                </a>
                <a
                  href="https://www.he-arc.ch/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={hearcLogo} />
                </a>
              </ImageColumns>
              <p>
                Initially developed by Xavier Stouder as part of his Bachelor
                thesis at the University of Applied Sciences and Arts Western
                Switzerland (HES-SO).
              </p>
              <p>All rights reserved. Released under MIT license.</p>
            </AboutContent>
          </Modal.Body>
        </StyledModalBody>
        <Modal.Footer>
          <LinksContainer>
            <a
              href="https://github.com/zakodium-oss/pixelium"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub /> Source code
            </a>
            <a
              href="https://github.com/zakodium-oss/pixelium/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
            >
              <FaFileSignature /> License
            </a>
          </LinksContainer>
        </Modal.Footer>
      </AboutModalStyle>
    </Modal>
  );
}

export default memo(AboutModal);
