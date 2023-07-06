import startCase from 'lodash/startCase';
import { memo, useCallback, useMemo, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Checkbox, Table, Toolbar, ValueRenderers } from 'react-science/ui';

import usePreferences from '../../hooks/usePreferences';
import usePreferencesDispatch from '../../hooks/usePreferencesDispatch';
import useViewDispatch from '../../hooks/useViewDispatch';
import { SET_ROIS_PREFERENCES } from '../../state/preferences/PreferenceActionTypes';
import {
  availableRoiColumns,
  RoiColumn,
} from '../../state/preferences/PreferencesReducer';
import { SET_EDIT_ROI_PREFERENCE } from '../../state/view/ViewActionTypes';

const defaultROIPreference = {
  columns: availableRoiColumns,
};

interface ROIEditColumnPreferenceProps {
  identifier: string;
}

function ROIEditColumnPreference({ identifier }: ROIEditColumnPreferenceProps) {
  const preferences = usePreferences();
  const viewDispatch = useViewDispatch();
  const preferencesDispatch = usePreferencesDispatch();

  const currentROIPreferences = useMemo(
    () => preferences.roisPreferences[identifier] ?? defaultROIPreference,
    [identifier, preferences.roisPreferences],
  );

  const [shownColumns, setShownColumns] = useState(
    currentROIPreferences.columns,
  );

  const isColumnShown = useCallback(
    (column: RoiColumn) => {
      return shownColumns.includes(column);
    },
    [shownColumns],
  );

  const changeChecked = useCallback(
    (column: RoiColumn, checked: boolean) => {
      setShownColumns(
        checked
          ? [...shownColumns, column].sort(
              (a, b) =>
                availableRoiColumns.indexOf(a) - availableRoiColumns.indexOf(b),
            )
          : shownColumns.filter((c) => c !== column),
      );
    },
    [shownColumns],
  );

  const close = useCallback(
    () =>
      viewDispatch({
        type: SET_EDIT_ROI_PREFERENCE,
        payload: false,
      }),
    [viewDispatch],
  );

  const handleSave = useCallback(() => {
    preferencesDispatch({
      type: SET_ROIS_PREFERENCES,
      payload: {
        identifier,
        preferences: {
          columns: shownColumns,
        },
      },
    });

    close();
  }, [close, identifier, preferencesDispatch, shownColumns]);

  const handleCancel = useMemo(() => close, [close]);

  return (
    <>
      <Toolbar orientation="horizontal">
        <Toolbar.Item
          title="Save"
          titleOrientation="horizontal"
          onClick={handleSave}
        >
          <FaCheck />
        </Toolbar.Item>
        <Toolbar.Item
          title="Cancel"
          titleOrientation="horizontal"
          onClick={handleCancel}
        >
          <FaTimes />
        </Toolbar.Item>
      </Toolbar>
      <Table>
        <Table.Header>
          <ValueRenderers.Title value="Label" />
          <ValueRenderers.Title value="Name" />
          <ValueRenderers.Title value="Visible" />
        </Table.Header>
        {availableRoiColumns.map((column) => (
          <Table.Row key={column}>
            <ValueRenderers.Text value={startCase(column)} />
            <ValueRenderers.Text value={column} />
            <ValueRenderers.Component>
              <Checkbox
                checked={isColumnShown(column)}
                onChange={(checked) =>
                  changeChecked(column, checked as boolean)
                }
              />
            </ValueRenderers.Component>
          </Table.Row>
        ))}
      </Table>
    </>
  );
}

export default memo(ROIEditColumnPreference);
