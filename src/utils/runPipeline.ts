import { Image, Mask, RotateAngle } from 'image-js';

import { PipelineOperations } from '../state/data/actions/pipeline/PipelineOperations';

export interface PipelineStep {
  identifier: string;
  result: Image | Mask;
  time: number;
}

function runPipelineOperation(
  operation: PipelineOperations,
  applyOn: Image | Mask,
) {
  switch (operation.type) {
    case 'GREY_FILTER': {
      if (applyOn instanceof Image) {
        return applyOn.grey({
          algorithm: operation.options.algorithm,
        });
      }
      break;
    }
    case 'CONVERT': {
      if (applyOn instanceof Image) {
        if (operation.options.colorModel !== applyOn.colorModel) {
          applyOn = applyOn.convertColor(operation.options.colorModel);
        }
        if (operation.options.bitDepth !== applyOn.bitDepth) {
          applyOn = applyOn.convertBitDepth(operation.options.bitDepth);
        }
        return applyOn;
      }
      break;
    }
    case 'BLUR': {
      if (applyOn instanceof Image) {
        return applyOn.blur({
          width: operation.options.width,
          height: operation.options.height,
          borderType: operation.options.borderType,
          borderValue: operation.options.borderValue,
        });
      }
      break;
    }
    case 'MASK': {
      if (applyOn instanceof Image) {
        return applyOn.threshold({
          algorithm: operation.options.algorithm,
          slots: operation.options.slots,
        });
      }
      break;
    }
    case 'GAUSSIAN_BLUR': {
      if (applyOn instanceof Image) {
        return applyOn.gaussianBlur({
          sigmaX: operation.options.sigmaX,
          sigmaY: operation.options.sigmaY,
          sizeX: operation.options.sizeX,
          sizeY: operation.options.sizeY,
        });
      }
      break;
    }
    case 'INVERT': {
      return applyOn.invert();
    }
    case 'FLIP': {
      if (applyOn instanceof Image) {
        return applyOn.flip({
          axis: operation.options.axis,
        });
      }
      break;
    }
    case 'LEVEL': {
      if (applyOn instanceof Image) {
        return applyOn.level({
          channels: operation.options.channels,
          inputMin: operation.options.inputMin,
          inputMax: operation.options.inputMax,
          outputMin: operation.options.outputMin,
          outputMax: operation.options.outputMax,
          gamma: operation.options.gamma,
        });
      }
      break;
    }
    case 'PIXELATE': {
      if (applyOn instanceof Image) {
        return applyOn.pixelate({
          cellSize: operation.options.cellSize,
          algorithm: operation.options.algorithm,
        });
      }
      break;
    }
    case 'MEDIAN_FILTER': {
      if (applyOn instanceof Image) {
        return applyOn.medianFilter({
          cellSize: operation.options.cellSize,
          borderType: operation.options.borderType,
          borderValue: operation.options.borderValue,
        });
      }
      break;
    }
    case 'DILATE': {
      return applyOn.dilate({
        kernel: operation.options.kernel,
        iterations: operation.options.iterations,
      });
    }
    case 'ERODE': {
      return applyOn.erode({
        kernel: operation.options.kernel,
        iterations: operation.options.iterations,
      });
    }
    case 'OPEN': {
      return applyOn.open({
        kernel: operation.options.kernel,
        iterations: operation.options.iterations,
      });
    }
    case 'CLOSE': {
      return applyOn.close({
        kernel: operation.options.kernel,
        iterations: operation.options.iterations,
      });
    }
    case 'RESIZE': {
      if (applyOn instanceof Image) {
        return applyOn.resize({
          width: operation.options.width,
          height: operation.options.height,
          interpolationType: operation.options.interpolationType,
          borderValue: operation.options.borderValue,
          preserveAspectRatio: operation.options.preserveAspectRatio,
          borderType: operation.options.borderType,
        });
      }
      break;
    }
    case 'ROTATE': {
      if (applyOn instanceof Image) {
        return applyOn.rotate(
          (operation.options.angle *
            (operation.options.clockwise ? 1 : -1)) as RotateAngle,
        );
      }
      break;
    }
    default:
      throw new Error(`Unknown operation type ${(operation as any).type}`);
  }
}

export default function runPipeline(
  pipeline: PipelineOperations[],
  baseImage: Image,
) {
  const pipelineSteps: PipelineStep[] = [];
  let pipelineError: string | undefined;

  let result: Image | Mask = baseImage;

  for (const [, operation] of pipeline.entries()) {
    if (!operation.isActive) {
      break;
    }

    if (result === undefined) break;

    const time0 = performance.now();

    try {
      result = runPipelineOperation(operation, result) ?? baseImage;
    } catch (error: any) {
      pipelineError = error.message;
      break;
    }

    const time = performance.now() - time0;
    pipelineSteps.push({
      identifier: operation.identifier,
      result,
      time,
    });
  }

  return { pipelineSteps, pipelineError };
}
