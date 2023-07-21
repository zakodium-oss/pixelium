import styled from '@emotion/styled';
import { memo } from 'react';
import { ValueRenderers, Accordion, Table } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import useImageInformations from '../../hooks/useImageInformations';
import Histograms from '../histogram/Histograms';
import MetadataTable from '../metadatas/MetadataTable';
import PipelineTable from '../pipeline/PipelineTable';
import ROIAccordion from '../rois/ROIAccordion';

const StyledSidebar = styled.div`
  width: 100%;
  min-width: 300px;
`;

function Sidebar() {
  const currentTab = useCurrentTab();

  const { original } = useImage();

  const generalInformations = useImageInformations(original);

  if (currentTab === undefined) return null;
  return (
    <StyledSidebar>
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
          <MetadataTable />
        </Accordion.Item>
        <Accordion.Item title="Histograms">
          <Histograms />
        </Accordion.Item>
        <Accordion.Item title="Pipeline">
          <PipelineTable identifier={currentTab} />
        </Accordion.Item>
        <ROIAccordion />
      </Accordion>
    </StyledSidebar>
  );
}

export default memo(Sidebar);
