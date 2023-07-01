import { Image, ImageColorModel } from 'image-js';
import { memo, useMemo } from 'react';
import { ValueRenderers, Accordion, Table } from 'react-science/ui';

import useCurrentTab from '../hooks/useCurrentTab';
import useImage from '../hooks/useImage';
import useImageInformations from '../hooks/useImageInformations';

import Histograms from './histogram/Histograms';
import MetadataTable from './metadatas/MetadataTable';
import PipelineTable from './pipeline/PipelineTable';
import ROITable from './rois/ROITable';

function Sidebar() {
  const currentTab = useCurrentTab();

  const { original, pipelined } = useImage(currentTab);

  const generalInformations = useImageInformations(original);

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
          <MetadataTable />
        </Accordion.Item>
        <Accordion.Item title="Histograms">
          <Histograms image={pipelinedAsImage} />
        </Accordion.Item>
        <Accordion.Item title="Pipeline">
          <PipelineTable identifier={currentTab} />
        </Accordion.Item>
        <Accordion.Item title="ROIs">
          <ROITable identifier={currentTab} />
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default memo(Sidebar);
