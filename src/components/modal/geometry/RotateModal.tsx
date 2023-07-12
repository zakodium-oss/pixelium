import { Image, RotateAngle } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Checkbox, Field, Select } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_ROTATE } from '../../../state/data/DataActionTypes';
import RotateOptions from '../../../types/RotateOptions';
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

  const resizedImage = useMemo(() => {
    if (pipelined instanceof Image) {
      try {
        if (rotateOptions.angle === 0) return pipelined;
        return pipelined.rotate(
          (rotateOptions.angle *
            (rotateOptions.clockwise ? 1 : -1)) as RotateAngle,
        );
      } catch {
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
    () => [
      [0, 90, 180, 270].map((rotateAngle) => ({
        label: `${rotateAngle}`,
        value: `${rotateAngle}`,
      })),
    ],
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
    >
      <Field name="clockwise" label="Clockwise">
        <Checkbox
          checked={rotateOptions.clockwise}
          onChange={(checked) =>
            setRotateOptions({
              ...rotateOptions,
              clockwise: checked as boolean,
            })
          }
        />
      </Field>
      <Field name="angle" label="Angle">
        <Select
          value={`${rotateOptions.angle}`}
          options={rotateAngleOptions}
          onSelect={(value) => {
            if (value === undefined) return;
            setRotateOptions({
              ...rotateOptions,
              angle: Number.parseInt(value) as RotateAngle | 0,
            });
          }}
        />
      </Field>
    </PreviewModal>
  );
}

export default memo(RotateModal);
