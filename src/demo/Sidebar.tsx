import styled from '@emotion/styled';
import { WebSource } from 'filelist-utils';
import ky from 'ky';
import { Fragment, memo, useEffect, useState } from 'react';
import { Button } from 'react-science/ui';

const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  color: white;
  background-color: cornflowerblue;
  padding: 0 20px;

  h1 {
    font-size: 1.5rem;
    margin: 0;
    padding: 20px 0;
    border-bottom: 1px solid white;
  }

  h2 {
    font-size: 1.2rem;
    margin: 0;
    padding: 10px 0;
    border-bottom: 1px solid white;
  }

  button {
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  gap: 10px;
`;

interface TocResponse {
  title: string;
  sections: {
    title: string;
    sources: {
      name: string;
      source: WebSource;
    }[];
  }[];
}

interface SidebarProps {
  setWebSource: (webSource: WebSource) => void;
}

function Sidebar({ setWebSource }: SidebarProps) {
  const [toc, setToC] = useState<TocResponse>({
    title: '',
    sections: [],
  });

  const [selectedSource, setSelectedSource] = useState<WebSource>();

  useEffect(() => {
    ky.get('https://image-js.github.io/image-dataset-demo/toc.json')
      .json<TocResponse>()
      .then(setToC)
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedSource) {
      setWebSource(selectedSource);
    }
  }, [selectedSource, setWebSource]);

  return (
    <StyledSidebar>
      <h1>Pixelium</h1>
      {toc.sections.map((section) => (
        <Fragment key={section.title}>
          <h2>{section.title}</h2>
          <ButtonGroup>
            {section.sources
              .filter((source) => !source.name.includes('.json'))
              .map((source) => (
                <Button
                  key={source.name}
                  onClick={() => {
                    setSelectedSource(source.source);
                  }}
                >
                  {source.name}
                </Button>
              ))}
          </ButtonGroup>
        </Fragment>
      ))}
    </StyledSidebar>
  );
}

export default memo(Sidebar);
