import { memo, useMemo } from 'react';
import { Accordion } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useROIs from '../../hooks/useROIs';
import useView from '../../hooks/useView';

import ROIEditColumnPreference from './ROIEditPreference';
import ROITable from './ROITable';
import ROIToolbar from './ROIToolbar';

function ROIAccordion() {
  const currentTab = useCurrentTab();
  const rois = useROIs(currentTab);
  const view = useView();
  const isEditing = useMemo(
    () => view.editROIPreference,
    [view.editROIPreference],
  );

  if (currentTab === undefined) return null;

  return (
    <Accordion.Item title="ROIs" defaultOpened={rois.length > 0}>
      {isEditing ? (
        <ROIEditColumnPreference />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          }}
        >
          <ROIToolbar identifier={currentTab} />
          <ROITable identifier={currentTab} />
        </div>
      )}
    </Accordion.Item>
  );
}

export default memo(ROIAccordion);
