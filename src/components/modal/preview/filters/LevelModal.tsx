import { Checkbox, FormGroup, InputGroup } from '@blueprintjs/core';
import { channelLabels, Image } from 'image-js';
import times from 'lodash/times';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import useView from '../../../../hooks/useView';
import { SET_LEVEL } from '../../../../state/data/DataActionTypes';
import PreviewModal from '../PreviewModal';

interface LevelModalProps {
  previewImageIdentifier: string;
}

interface LocalLevelOptions {
  channels: number[];
  inputMin: number;
  inputMax: number;
  outputMin: number;
  outputMax: number;
  gamma: number;
}

function LevelModal({ previewImageIdentifier }: LevelModalProps) {
  const view = useView();

  const { pipelined } = useImage(view.editMode?.opIdentifier);

  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<LocalLevelOptions>({
      channels: times(pipelined.components, (i) => i),
      inputMin: 0,
      inputMax: pipelined.maxValue,
      outputMin: 0,
      outputMax: pipelined.maxValue,
      gamma: 1,
    });

  const [options, setOptions] = useState<LocalLevelOptions>(defaultOptions);

  const [algoError, setAlgoError] = useState<string>();
  const leveledImage = useMemo(() => {
    setAlgoError(undefined);
    if (pipelined instanceof Image) {
      try {
        return pipelined.level(options);
      } catch (error: any) {
        setAlgoError(error.message);
        return null;
      }
    }
    return null;
  }, [options, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('level');

  const addLevelFilter = useCallback(() => {
    dataDispatch({
      type: SET_LEVEL,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options,
      },
    });
    close();
  }, [close, dataDispatch, opIdentifier, options, previewImageIdentifier]);

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Level image"
      viewIdentifier="__level_preview"
      apply={addLevelFilter}
      original={pipelined}
      preview={leveledImage}
      editing={editing}
      algoError={algoError}
    >
      <FormGroup label="Level">
        {times(pipelined.components, (i) => (
          <Checkbox
            key={i}
            label={`Channel ${channelLabels[pipelined.colorModel][i]}`}
            checked={options.channels.includes(i)}
            onChange={(e) =>
              setOptions({
                ...options,
                channels: e.target.checked
                  ? [...options.channels, i]
                  : options.channels.filter((c) => c !== i),
              })
            }
          />
        ))}
      </FormGroup>
      <FormGroup label="Input min">
        <InputGroup
          type="number"
          value={options.inputMin?.toString()}
          onChange={(event) =>
            setOptions({
              ...options,
              inputMin: event.target.valueAsNumber,
            })
          }
        />
      </FormGroup>
      <FormGroup label="Input max">
        <InputGroup
          type="number"
          value={options.inputMax?.toString()}
          onChange={(event) =>
            setOptions({
              ...options,
              inputMax: event.target.valueAsNumber,
            })
          }
        />
      </FormGroup>
      <FormGroup label="Output min">
        <InputGroup
          type="number"
          value={options.outputMin?.toString()}
          onChange={(event) =>
            setOptions({
              ...options,
              outputMin: event.target.valueAsNumber,
            })
          }
        />
      </FormGroup>
      <FormGroup label="Output max">
        <InputGroup
          type="number"
          value={options.outputMax?.toString()}
          onChange={(event) =>
            setOptions({
              ...options,
              outputMax: event.target.valueAsNumber,
            })
          }
        />
      </FormGroup>
      <FormGroup label="Gamma">
        <InputGroup
          type="number"
          value={options.gamma?.toString()}
          onChange={(event) =>
            setOptions({
              ...options,
              gamma: event.target.valueAsNumber,
            })
          }
        />
      </FormGroup>
    </PreviewModal>
  );
}

export default memo(LevelModal);
