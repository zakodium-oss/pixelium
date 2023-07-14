import { memo, useMemo } from 'react';
import { Accordion } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useView from '../../hooks/useView';

import ROIEditColumnPreference from './ROIEditPreference';
import ROITable from './ROITable';
import ROIToolbar from './ROIToolbar';

function ROIAccordion() {
  const currentTab = useCurrentTab();

  const view = useView();
  const isEditing = useMemo(
    () => view.editROIPreference,
    [view.editROIPreference],
  );

  if (currentTab === undefined) return null;

  return (
    <Accordion.Item title="ROIs">
      {isEditing ? (
        <ROIEditColumnPreference />
      ) : (
        <>
          <ROIToolbar identifier={currentTab} />
          <ROITable identifier={currentTab} />
        </>
      )}
    </Accordion.Item>
  );
}

export default memo(ROIAccordion);
