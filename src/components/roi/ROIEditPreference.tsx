import styled from '@emotion/styled';
import startCase from 'lodash/startCase';
import { CSSProperties, memo, useCallback, useMemo, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import {
  Checkbox,
  ColorPickerDropdown,
  Input,
  Table,
  Toolbar,
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
      <Toolbar orientation="horizontal">
        <Toolbar.Item
          title="Save"
          titleOrientation="horizontal"
          onClick={handleSave}
        >
          <FaCheck color="green" />
        </Toolbar.Item>
        <Toolbar.Item
          title="Cancel"
          titleOrientation="horizontal"
          onClick={handleCancel}
        >
          <FaTimes color="red" />
        </Toolbar.Item>
      </Toolbar>
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
          <Table style={tableStyle}>
            <Table.Header>
              <ValueRenderers.Title value="Kind" />
              <ValueRenderers.Title value="Color" />
              <ValueRenderers.Title value="Display value" />
              <ValueRenderers.Title value="Font size" />
              <ValueRenderers.Title value="Font color" />
            </Table.Header>
            {Object.keys(annotationsPreferences).map((key) => (
              <Table.Row key={key}>
                <ValueRenderers.Text value={startCase(key)} />
                <ValueRenderers.Component>
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
                </ValueRenderers.Component>
                <ValueRenderers.Component>
                  <Checkbox
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
                </ValueRenderers.Component>
                <ValueRenderers.Component>
                  <Input
                    type="number"
                    value={annotationsPreferences[key].fontSize}
                    onChange={(event) => {
                      const newValue = event.target.valueAsNumber;
                      setAnnotationsPreferences({
                        ...annotationsPreferences,
                        [key]: {
                          ...annotationsPreferences[key],
                          fontSize: newValue,
                        },
                      });
                    }}
                  />
                </ValueRenderers.Component>
                <ValueRenderers.Component>
                  <ColorPickerDropdown
                    disableAlpha
                    color={{ hex: annotationsPreferences[key].fontColor }}
                    onChange={(color) =>
                      setAnnotationsPreferences({
                        ...annotationsPreferences,
                        [key]: {
                          ...annotationsPreferences[key],
                          fontColor: color.hex,
                        },
                      })
                    }
                  />
                </ValueRenderers.Component>
              </Table.Row>
            ))}
          </Table>
        </EditGroup>
      </PaddedContent>
    </>
  );
}

export default memo(ROIEditPreference);
