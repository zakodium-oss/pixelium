import styled from '@emotion/styled';
import startCase from 'lodash/startCase';
import { CSSProperties, memo, useCallback, useMemo, useState } from 'react';
import {
  Checkbox,
  ColorPickerDropdown,
  PanelPreferencesToolbar,
  Table,
  ValueRenderers,
} from 'react-science/ui';

import usePreferences from '../../hooks/usePreferences';
import usePreferencesDispatch from '../../hooks/usePreferencesDispatch';
import useViewDispatch from '../../hooks/useViewDispatch';
import {
  SET_ROIS_ANNOTATIONS,
  SET_ROIS_COLUMNS,
} from '../../state/preferences/PreferenceActionTypes';
import {
  availableRoiColumns,
  RoiColumn,
} from '../../state/preferences/PreferencesReducer';
import { SET_EDIT_ROI_PREFERENCE } from '../../state/view/ViewActionTypes';

const PaddedContent = styled.div`
  padding: 0.5rem;
`;

const RoiEditTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`;

const EditGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
  }
`;

const AnnotationGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.5rem;

  & > :first-of-type {
    white-space: nowrap;
  }
`;

const tableStyle: CSSProperties = {
  width: '100%',
};

function ROIEditPreference() {
  const preferences = usePreferences();
  const viewDispatch = useViewDispatch();
  const preferencesDispatch = usePreferencesDispatch();

  const [shownColumns, setShownColumns] = useState(preferences.rois.columns);
  const [annotationsPreferences, setAnnotationsPreferences] = useState(
    preferences.rois.annotations,
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
      type: SET_ROIS_COLUMNS,
      payload: shownColumns,
    });

    preferencesDispatch({
      type: SET_ROIS_ANNOTATIONS,
      payload: annotationsPreferences,
    });

    close();
  }, [annotationsPreferences, close, preferencesDispatch, shownColumns]);

  const handleCancel = useMemo(() => close, [close]);

  return (
    <>
      <PanelPreferencesToolbar onClose={handleCancel} onSave={handleSave} />
      <PaddedContent>
        <EditGroup>
          <RoiEditTitle>Shown columns</RoiEditTitle>
          <Table style={tableStyle}>
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
        </EditGroup>
        <EditGroup>
          <RoiEditTitle>Annotations</RoiEditTitle>
          <CheckboxGroup>
            {Object.keys(annotationsPreferences).map((key) => (
              <AnnotationGroup key={key}>
                <Checkbox
                  label={startCase(key)}
                  checked={annotationsPreferences[key].enabled}
                  onChange={(checked) =>
                    setAnnotationsPreferences({
                      ...annotationsPreferences,
                      [key]: {
                        ...annotationsPreferences[key],
                        enabled: checked as boolean,
                      },
                    })
                  }
                />
                <ColorPickerDropdown
                  disableAlpha
                  color={{ hex: annotationsPreferences[key].color }}
                  onChange={(color) =>
                    setAnnotationsPreferences({
                      ...annotationsPreferences,
                      [key]: {
                        ...annotationsPreferences[key],
                        color: color.hex,
                      },
                    })
                  }
                />
              </AnnotationGroup>
            ))}
          </CheckboxGroup>
        </EditGroup>
      </PaddedContent>
    </>
  );
}

export default memo(ROIEditPreference);
