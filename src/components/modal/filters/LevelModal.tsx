import { BlurOptions, BorderType, channelLabels, Image } from 'image-js';
import times from 'lodash/times';
import { memo, useCallback, useMemo, useState } from 'react';
import { Checkbox, Field, Input } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_LEVEL } from '../../../state/data/DataActionTypes';
import FilterModal from '../FilterModal';

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
  const { pipelined } = useImage(previewImageIdentifier);

  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<LocalLevelOptions>({
      channels: new Array(pipelined.components).fill(0).map((_, i) => i),
      inputMin: 0,
      inputMax: pipelined.maxValue,
      outputMin: 0,
      outputMax: pipelined.maxValue,
      gamma: 1,
    });

  const [options, setOptions] = useState<LocalLevelOptions>(defaultOptions);

  const leveledImage = useMemo(
    () => (pipelined instanceof Image ? pipelined.level(options) : pipelined),
    [options, pipelined],
  );

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
    <FilterModal
      previewImageIdentifier={previewImageIdentifier}
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Level image"
      viewIdentifier="__level_preview"
      apply={addLevelFilter}
      previewed={leveledImage}
      editing={editing}
    >
      <Field name="level" label="Level">
        {times(pipelined.components, (i) => (
          <Checkbox
            key={i}
            label={`Channel ${channelLabels[pipelined.colorModel][i]}`}
            checked={options.channels.includes(i)}
            onChange={(checked) =>
              setOptions({
                ...options,
                channels: checked
                  ? [...options.channels, i]
                  : options.channels.filter((c) => c !== i),
              })
            }
          />
        ))}
      </Field>
      <Field name="inputMin" label="Input min">
        <Input
          type="number"
          value={options.inputMin}
          onChange={(event) =>
            setOptions({
              ...options,
              inputMin: event.target.valueAsNumber,
            })
          }
        />
      </Field>
      <Field name="inputMax" label="Input max">
        <Input
          type="number"
          value={options.inputMax}
          onChange={(event) =>
            setOptions({
              ...options,
              inputMax: event.target.valueAsNumber,
            })
          }
        />
      </Field>
      <Field name="outputMin" label="Output min">
        <Input
          type="number"
          value={options.outputMin}
          onChange={(event) =>
            setOptions({
              ...options,
              outputMin: event.target.valueAsNumber,
            })
          }
        />
      </Field>
      <Field name="outputMax" label="Output max">
        <Input
          type="number"
          value={options.outputMax}
          onChange={(event) =>
            setOptions({
              ...options,
              outputMax: event.target.valueAsNumber,
            })
          }
        />
      </Field>
      <Field name="gamma" label="Gamma">
        <Input
          type="number"
          value={options.gamma}
          onChange={(event) =>
            setOptions({
              ...options,
              gamma: event.target.valueAsNumber,
            })
          }
        />
      </Field>
    </FilterModal>
  );
}

export default memo(LevelModal);
