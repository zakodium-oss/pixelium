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
            value={`${currentImage.width} x ${currentImage.height} (${
              currentImage.width * currentImage.height
            } pixels)`}
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
    ];
  }, [currentImage]);

  return (
    <Accordion>
      <Accordion.Item title="General informations">
        {currentImage === null ? null : (
          <Table>
            {generalInformations.map(({ key, render }) => (
              <Table.Row key={key}>
                <ValueRenderers.Text value={key} />
                {render}
              </Table.Row>
            ))}
          </Table>
        )}
      </Accordion.Item>
    </Accordion>
  );
}

export default memo(Sidebar);
