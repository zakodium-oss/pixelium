import { Checkbox, InputGroup } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { colord } from 'colord';
import startCase from 'lodash/startCase';
import { CSSProperties, memo, useCallback, useMemo, useState } from 'react';
import {
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
import { useROIDispatch } from '../context/ROIContext';

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
  const roiDispatch = useROIDispatch();

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
      roiDispatch({
        type: 'REMOVE_FILTER',
        payload: {
          column,
        },
      });
      setShownColumns(
        checked
          ? [...shownColumns, column].sort(
              (a, b) =>
                availableRoiColumns.indexOf(a) - availableRoiColumns.indexOf(b),
            )
          : shownColumns.filter((c) => c !== column),
      );
    },
    [roiDispatch, shownColumns],
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
              <ValueRenderers.Header value="Label" />
              <ValueRenderers.Header value="Name" />
              <ValueRenderers.Header value="Visible" />
            </Table.Header>
            {availableRoiColumns.map((column) => (
              <Table.Row key={column}>
                <ValueRenderers.Text value={startCase(column)} />
                <ValueRenderers.Text value={column} />
                <ValueRenderers.Component>
                  <Checkbox
                    checked={isColumnShown(column)}
                    onChange={(e) => changeChecked(column, e.target.checked)}
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
              <ValueRenderers.Header value="Kind" />
              <ValueRenderers.Header value="Color" />
              <ValueRenderers.Header value="Display" />
              <ValueRenderers.Header value="Display value" />
              <ValueRenderers.Header value="Font size" />
              <ValueRenderers.Header value="Font color" />
            </Table.Header>
            {Object.keys(annotationsPreferences).map((key) => (
              <Table.Row key={key}>
                <ValueRenderers.Text value={startCase(key)} />
                <ValueRenderers.Component>
                  <ColorPickerDropdown
                    color={{
                      hex: colord(annotationsPreferences[key].color.hex)
                        .alpha(annotationsPreferences[key].color.a)
                        .toHex(),
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
                    onChange={(e) =>
                      setAnnotationsPreferences({
                        ...annotationsPreferences,
                        [key]: {
                          ...annotationsPreferences[key],
                          enabled: e.target.checked,
                        },
                      })
                    }
                  />
                </ValueRenderers.Component>
                <ValueRenderers.Component>
                  <Checkbox
                    checked={annotationsPreferences[key].displayValue}
                    onChange={(e) =>
                      setAnnotationsPreferences({
                        ...annotationsPreferences,
                        [key]: {
                          ...annotationsPreferences[key],
                          displayValue: e.target.checked,
                        },
                      })
                    }
                  />
                </ValueRenderers.Component>
                <ValueRenderers.Component>
                  <InputGroup
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
                      hex: colord(annotationsPreferences[key].fontColor.hex)
                        .alpha(annotationsPreferences[key].fontColor.a)
                        .toHex(),
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
export default memo(ROIEditPreference);
