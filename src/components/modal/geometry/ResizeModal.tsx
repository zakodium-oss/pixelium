import { BorderType, Image, InterpolationType, ResizeOptions } from 'image-js';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Field, Input, Select } from 'react-science/ui';

import useDataDispatch from '../../../hooks/useDataDispatch';
import useDefaultOptions from '../../../hooks/useDefaultOptions';
import useImage from '../../../hooks/useImage';
import useModal from '../../../hooks/useModal';
import { SET_RESIZE } from '../../../state/data/actions/pipeline/geometry/resize';
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

  const resizedImage = useMemo(() => {
    if (pipelined instanceof Image) {
      try {
        return pipelined.resize(resizeOptions);
      } catch {
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
    () => [
      Object.keys(BorderType).map((borderType) => ({
        label: BorderType[borderType],
        value: BorderType[borderType],
      })),
    ],
    [],
  );

  const interpolationTypeOptions = useMemo(
    () => [
      Object.keys(InterpolationType).map((interpolationType) => ({
        label: InterpolationType[interpolationType],
        value: InterpolationType[interpolationType],
      })),
    ],
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
    >
      <Field name="preserveAspectRatio" label="Preserve aspect ratio">
        <Checkbox
          checked={resizeOptions.preserveAspectRatio}
          onChange={(checked) =>
            setResizeOptions({
              ...resizeOptions,
              preserveAspectRatio: checked as boolean,
            })
          }
        />
      </Field>
      <Field name="outputWidth" label="Output width">
        <Input
          type="number"
          name="outputWidth"
          value={resizeOptions.width}
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
      </Field>

      <Field name="outputHeight" label="Output height">
        <Input
          type="number"
          name="outputWidth"
          value={resizeOptions.height}
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
      </Field>

      <Field name="interpolationType" label="Interpolation type">
        <Select
          value={resizeOptions.interpolationType}
          options={interpolationTypeOptions}
          onSelect={(value) => {
            setResizeOptions({
              ...resizeOptions,
              interpolationType: value as InterpolationType,
            });
          }}
        />
      </Field>

      <Field name="borderType" label="Border type">
        <Select
          value={resizeOptions.borderType}
          options={borderTypeOptions}
          onSelect={(value) => {
            setResizeOptions({
              ...resizeOptions,
              borderType: value as BorderType,
            });
          }}
        />
      </Field>

      {resizeOptions.borderType === BorderType.CONSTANT && (
        <Field name="borderValue" label="Border value">
          <Input
            type="number"
            name="borderValue"
            value={resizeOptions.borderValue}
            onChange={(e) => {
              setResizeOptions({
                ...resizeOptions,
                borderValue: e.target.valueAsNumber,
              });
            }}
          />
        </Field>
      )}
    </PreviewModal>
  );
}

export default memo(ResizeModal);
