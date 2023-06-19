import styled from '@emotion/styled';
import { Image, ImageColorModel } from 'image-js';
import { memo, useMemo } from 'react';
import { ValueRenderers, Accordion, Table } from 'react-science/ui';

import useCurrentTab from '../hooks/useCurrentTab';
import useImage from '../hooks/useImage';
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
  const currentTab = useCurrentTab();

  const { original, pipelined } = useImage(currentTab);

  const generalInformations = useImageInformations(original);
  const metadatas = useImageMetadata(original);

  const pipelinedAsImage = useMemo(
    () =>
      pipelined instanceof Image
        ? pipelined
        : pipelined.convertColor(ImageColorModel.GREY),
    [pipelined],
  );

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
          <Histograms image={pipelinedAsImage} />
        </Accordion.Item>
        <Accordion.Item title="Pipeline">
          <PipelineTable identifier={currentTab} />
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default memo(Sidebar);
