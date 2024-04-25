import { ColumnFiltersState } from '@tanstack/react-table';
import { memo, useMemo, useState } from 'react';
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  if (currentTab === undefined) return null;

  return (
    <Accordion.Item title="ROIs">
      <div style={{ display: isEditing ? 'block' : 'none' }}>
        <ROIEditColumnPreference />
      </div>
      <div
        style={{
          display: isEditing ? 'none' : 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <ROIToolbar
          identifier={currentTab}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <ROITable
          identifier={currentTab}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </div>
    </Accordion.Item>
  );
}

export default memo(ROIAccordion);
