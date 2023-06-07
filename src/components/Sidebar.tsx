import { memo, useMemo } from 'react';
import { ValueRenderers, Accordion, Table } from 'react-science/ui';

import useData from '../hooks/useData';
import useView from '../hooks/useView';

function Sidebar() {
  const data = useData();
  const view = useView();

  const currentImage = useMemo(() => {
    if (view.currentTab === undefined) return null;
    return data.files[view.currentTab].image;
  }, [data.files, view.currentTab]);

  const generalInformations = useMemo(() => {
    if (currentImage === null) return [];
    return [
      {
        key: 'Image size',
        render: (
          <ValueRenderers.Text
            value={`${currentImage.width.toLocaleString()} x ${currentImage.height.toLocaleString()} (${(
              currentImage.width * currentImage.height
            ).toLocaleString()} pixels)`}
          />
        ),
      },
      {
        key: 'Bit depth',
        render: <ValueRenderers.Number value={currentImage.bitDepth} />,
      },
      {
        key: 'Channels',
        render: <ValueRenderers.Number value={currentImage.channels} />,
      },
      {
        key: 'Components',
        render: <ValueRenderers.Number value={currentImage.components} />,
      },
      {
        key: 'Color model',
        render: <ValueRenderers.Text value={currentImage.colorModel} />,
      },
    ];
  }, [currentImage]);

  if (currentImage === null) return null;
  return (
    <div style={{ width: '100%', minWidth: '300px' }}>
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
      </Accordion>
    </div>
  );
}

export default memo(Sidebar);
