import styled from '@emotion/styled';
import startCase from 'lodash/startCase';
import { CSSProperties, memo, useCallback, useMemo, useState } from 'react';
import {
  Checkbox,
  ColorPickerDropdown,
  Input,
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
  overflow: auto;
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
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
          <Table style={tableStyle}>
            <Table.Header>
              <ValueRenderers.Title value="Kind" />
              <ValueRenderers.Title value="Color" />
              <ValueRenderers.Title value="Display" />
              <ValueRenderers.Title value="Display value" />
              <ValueRenderers.Title value="Font size" />
              <ValueRenderers.Title value="Font color" />
            </Table.Header>
            {Object.keys(annotationsPreferences).map((key) => (
              <Table.Row key={key}>
                <ValueRenderers.Text value={startCase(key)} />
                <ValueRenderers.Component>
                  <ColorPickerDropdown
                    color={{
                      a: annotationsPreferences[key].color.a,
                      ...hexToRgb(annotationsPreferences[key].color.hex),
                    }}
                    onChange={(color) => {
                      setAnnotationsPreferences({
                        ...annotationsPreferences,
                        [key]: {
                          ...annotationsPreferences[key],
                          color: { hex: color.hex, a: color.rgb.a },
                        },
                      });
                    }}
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
                  <Checkbox
                    checked={annotationsPreferences[key].displayValue}
                    onChange={(checked) =>
                      setAnnotationsPreferences({
                        ...annotationsPreferences,
                        [key]: {
                          ...annotationsPreferences[key],
                          displayValue: checked as boolean,
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
                    color={{
                      a: annotationsPreferences[key].fontColor.a,
                      ...hexToRgb(annotationsPreferences[key].fontColor.hex),
                    }}
                    onChange={(color) =>
                      setAnnotationsPreferences({
                        ...annotationsPreferences,
                        [key]: {
                          ...annotationsPreferences[key],
                          fontColor: { hex: color.hex, a: color.rgb.a },
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
    </div>
  );
}
function hexToRgb(hex: string) {
  if (hex.length !== 7) {
    hex = hex.replace(/#/, '#000000');
  }
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}
export default memo(ROIEditPreference);
