import styled from '@emotion/styled';
import { memo, useMemo } from 'react';
import { ValueRenderers, Accordion, Table } from 'react-science/ui';

import useCurrentTab from '../hooks/useCurrentTab';
import useData from '../hooks/useData';
import useImageInformations from '../hooks/useImageInformations';
import useImageMetadata from '../hooks/useImageMetadata';

import Histograms from './histogram/Histograms';
import PipelineTable from './pipeline/PipelineTable';

const MissingMetadata = styled.div`
  margin-top: 8px;
  font-size: 1.5em;
  text-align: center;
`;

function Sidebar() {
  const data = useData();
  const currentTab = useCurrentTab();

  const currentImage = useMemo(() => {
    if (currentTab === undefined) return null;
    return data.images[currentTab].image;
  }, [data.images, currentTab]);

  const generalInformations = useImageInformations(currentImage);
  const metadatas = useImageMetadata(currentImage);

  if (currentImage === null) return null;
  if (currentTab === undefined) return null;
  return (
    <div style={{ width: '100%', minWidth: 300 }}>
      <Accordion>
        <Accordion.Item title="General informations">
          <Table>
            {generalInformations.map(({ key, render }) => (
              <Table.Row key={key}>
                <ValueRenderers.Text value={key} />
                {render}
              </Table.Row>
            ))}
          </Table>
        </Accordion.Item>
        <Accordion.Item title="Metadatas">
          {metadatas.length === 0 ? (
            <MissingMetadata>No metadatas found</MissingMetadata>
          ) : (
            <Table>
              {metadatas.map(({ key, render }) => (
                <Table.Row key={key}>
                  <ValueRenderers.Text value={key} />
                  {render}
                </Table.Row>
              ))}
            </Table>
          )}
        </Accordion.Item>
        <Accordion.Item title="Histograms">
          <Histograms image={currentImage} />
        </Accordion.Item>
        <Accordion.Item title="Pipeline">
          <PipelineTable identifier={currentTab} />
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default memo(Sidebar);
