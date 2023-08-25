import styled from '@emotion/styled';
import { memo } from 'react';
import { Accordion } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import Histograms from '../histogram/Histograms';
import InformationPanel from '../information/InformationPanel';
import PipelineTable from '../pipeline/PipelineTable';
import ROIAccordion from '../roi/ROIAccordion';

const StyledSidebar = styled.div`
  width: 100%;
  min-width: 300px;
`;

function Sidebar() {
  const currentTab = useCurrentTab();

  if (currentTab === undefined) return null;
  return (
    <StyledSidebar>
      <Accordion>
        <Accordion.Item title="Informations">
          <InformationPanel />
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
