import { Checkbox, FormGroup, InputGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { BorderType, Image, InterpolationType, ResizeOptions } from 'image-js';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import useDataDispatch from '../../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../../hooks/useDefaultOptions';
import useImage from '../../../../hooks/useImage';
import useModal from '../../../../hooks/useModal';
import { SET_RESIZE } from '../../../../state/data/actions/pipeline/geometry/resize';
import PreviewModal from '../PreviewModal';

interface ResizeModalProps {
  previewImageIdentifier: string;
}

function ResizeModal({ previewImageIdentifier }: ResizeModalProps) {
  const { defaultOptions, editing, opIdentifier } =
    useDefaultOptions<ResizeOptions>({
      width: 0,
      height: 0,
      preserveAspectRatio: true,
      interpolationType: 'bilinear',
      borderType: BorderType.CONSTANT,
      borderValue: 0,
    });

  const { pipelined } = useImage(opIdentifier);

  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    ...defaultOptions,
  });

  useEffect(() => {
    setResizeOptions((resizeOptions) => ({
      ...resizeOptions,
      width: pipelined.width,
      height: pipelined.height,
    }));
  }, [pipelined]);

  const [algoError, setAlgoError] = useState<string>();
  const resizedImage = useMemo(() => {
    setAlgoError(undefined);
    if (pipelined instanceof Image) {
      try {
        return pipelined.resize(resizeOptions);
      } catch (error: any) {
        setAlgoError(error.message);
        return null;
      }
    }

    return null;
  }, [resizeOptions, pipelined]);

  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('resize');

  const addResize = useCallback(() => {
    dataDispatch({
      type: SET_RESIZE,
      payload: {
        identifier: previewImageIdentifier,
        opIdentifier,
        options: resizeOptions,
      },
    });
    close();
  }, [
    close,
    dataDispatch,
    opIdentifier,
    previewImageIdentifier,
    resizeOptions,
  ]);

  const borderTypeOptions = useMemo(
    () =>
      Object.keys(BorderType).map((borderType) => ({
        label: BorderType[borderType],
        value: BorderType[borderType],
      })),
    [],
  );

  const interpolationTypeOptions = useMemo(
    () =>
      Object.keys(InterpolationType).map((interpolationType) => ({
        label: InterpolationType[interpolationType],
        value: InterpolationType[interpolationType],
      })),
    [],
  );

  return (
    <PreviewModal
      closeDialog={close}
      isOpenDialog={isOpen}
      title="Resize image"
      viewIdentifier="__resize_preview"
      apply={addResize}
      original={pipelined}
      preview={resizedImage}
      editing={editing}
      algoError={algoError}
    >
      <Checkbox
        label="Preserve aspect ratio"
        alignIndicator="right"
        checked={resizeOptions.preserveAspectRatio}
        onChange={(e) =>
          setResizeOptions({
            ...resizeOptions,
            preserveAspectRatio: e.target.checked,
          })
        }
      />
      <FormGroup label="Output width">
        <InputGroup
          type="number"
          name="outputWidth"
          value={resizeOptions.width?.toString()}
          onChange={(e) => {
            const baseRatio =
              (resizeOptions.width ?? 0) / (resizeOptions.height ?? 1);
            setResizeOptions({
              ...resizeOptions,
              width: e.target.valueAsNumber,
              height: resizeOptions.preserveAspectRatio
                ? Math.round((e.target.valueAsNumber ?? 0) / baseRatio)
                : resizeOptions.height,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Output height">
        <InputGroup
          type="number"
          name="outputHeight"
          value={resizeOptions.height?.toString()}
          onChange={(e) => {
            const baseRatio =
              (resizeOptions.width ?? 0) / (resizeOptions.height ?? 1);
            setResizeOptions({
              ...resizeOptions,
              height: e.target.valueAsNumber,
              width: resizeOptions.preserveAspectRatio
                ? Math.round((e.target.valueAsNumber ?? 0) * baseRatio)
                : resizeOptions.width,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Interpolation type">
        <Select
          activeItem={interpolationTypeOptions.find(
            (item) => item.value === resizeOptions.interpolationType,
          )}
          items={interpolationTypeOptions}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              key={item.value}
              text={item.label}
              onClick={handleClick}
              active={modifiers.active}
              disabled={modifiers.disabled}
              selected={item.value === resizeOptions.interpolationType}
            />
          )}
          onItemSelect={(item) => {
            setResizeOptions({
              ...resizeOptions,
              interpolationType: item.value,
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Border type">
        <Select
          activeItem={borderTypeOptions.find(
            (item) => item.value === resizeOptions.borderType,
          )}
          items={borderTypeOptions}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              key={item.value}
              text={item.label}
              onClick={handleClick}
              active={modifiers.active}
              disabled={modifiers.disabled}
              selected={item.value === resizeOptions.borderType}
            />
          )}
          onItemSelect={(item) => {
            setResizeOptions({
              ...resizeOptions,
              borderType: item.value,
            });
          }}
        />
      </FormGroup>

      {resizeOptions.borderType === BorderType.CONSTANT && (
        <FormGroup label="Border value">
          <InputGroup
            type="number"
            name="borderValue"
            value={resizeOptions.borderValue?.toString()}
            onChange={(e) => {
              setResizeOptions({
                ...resizeOptions,
                borderValue: e.target.valueAsNumber,
              });
            }}
          />
        </FormGroup>
      )}
    </PreviewModal>
  );
}

export default memo(ResizeModal);
