import { Checkbox, FormGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { Image, RotateAngle } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_ROTATE } from '../../../../state/data/DataActionTypes';
import RotateOptions from '../../../../types/RotateOptions';
import PreviewModal from '../PreviewModal';

interface RotateModalProps {
  previewImageIdentifier: string;
}

function RotateModal({ previewImageIdentifier }: RotateModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<RotateOptions>({
      angle: 0,
      clockwise: true,
    });

  const { pipelined } = useImage(opIdentifier);

  const [rotateOptions, setRotateOptions] =
    useState<RotateOptions>(defaultOptions);

  const [algoError, setAlgoError] = useState<string>();
  const resizedImage = useMemo(() => {
    setAlgoError(undefined);
    if (pipelined instanceof Image) {
      try {
        if (rotateOptions.angle === 0) return pipelined;
        return pipelined.rotate(
          (rotateOptions.angle *
            (rotateOptions.clockwise ? 1 : -1)) as RotateAngle,
        );
      } catch (error: any) {
        setAlgoError(error.message);
        return null;
      }
    }
    return null;
  }, [pipelined, rotateOptions.angle, rotateOptions.clockwise]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('rotate');

  const addRotate = useCallback(() => {
    dataDispatch({
      type: SET_ROTATE,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: rotateOptions,
      },
    });
    close();
  }, [
    close,
    dataDispatch,
    opIdentifier,
    previewImageIdentifier,
    rotateOptions,
  ]);

  const rotateAngleOptions = useMemo(
    () =>
      [0, 90, 180, 270].map((rotateAngle) => ({
        label: `${rotateAngle}`,
        value: `${rotateAngle}`,
      })),
    [],
  );

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Rotate image"
      viewIdentifier="__rotate_preview"
      apply={addRotate}
      original={pipelined}
      preview={resizedImage}
      editing={editing}
      algoError={algoError}
    >
      <Checkbox
        label="Clockwise"
        alignIndicator="right"
        checked={rotateOptions.clockwise}
        onChange={(e) =>
          setRotateOptions({
            ...rotateOptions,
            clockwise: e.target.checked,
          })
        }
      />
      <FormGroup label="Angle">
        <Select
          activeItem={rotateAngleOptions.find(
            (item) => item.value === `${rotateOptions.angle}`,
          )}
          items={rotateAngleOptions}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              key={item.value}
              text={item.label}
              onClick={handleClick}
              active={modifiers.active}
              disabled={modifiers.disabled}
              selected={item.value === `${rotateOptions.angle}`}
            />
          )}
          onItemSelect={(item) => {
            if (item === undefined) return;
            setRotateOptions({
              ...rotateOptions,
              angle: Number.parseInt(item.value, 10) as RotateAngle | 0,
            });
          }}
        />
      </FormGroup>
    </PreviewModal>
  );
}

export default memo(RotateModal);
