import { Image, Mask, RotateAngle } from 'image-js';

import { PipelineOperations } from '../state/data/actions/pipeline/PipelineOperations';

export interface PipelineStep {
  identifier: string;
  result: Image | Mask;
  time: number;
}

export default function runPipeline(
  pipeline: PipelineOperations[],
  baseImage: Image,
) {
  const pipelineSteps: PipelineStep[] = [];
  let pipelineError: string | undefined;
  for (const [index, operation] of pipeline.entries()) {
    if (!operation.isActive) {
      break;
    }

    const applyOn = pipelineSteps[index - 1]?.result ?? baseImage;
    if (applyOn === undefined) break;

    let result = applyOn;
    const time0 = performance.now();

    try {
      switch (operation.type) {
        case 'GREY_FILTER': {
          if (applyOn instanceof Image) {
            result = applyOn.grey({
              algorithm: operation.options.algorithm,
            });
          }
          break;
        }
        case 'CONVERT': {
          if (applyOn instanceof Image && result instanceof Image) {
            if (operation.options.colorModel !== applyOn.colorModel) {
              result = result.convertColor(operation.options.colorModel);
            }
            if (operation.options.bitDepth !== applyOn.bitDepth) {
              result = result.convertBitDepth(operation.options.bitDepth);
            }
          }
          break;
        }
        case 'BLUR': {
          if (applyOn instanceof Image) {
            result = applyOn.blur({
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
            result = applyOn.threshold({
              algorithm: operation.options.algorithm,
              slots: operation.options.slots,
            });
          }
          break;
        }
        case 'GAUSSIAN_BLUR': {
          if (applyOn instanceof Image) {
            result = applyOn.gaussianBlur({
              sigmaX: operation.options.sigmaX,
              sigmaY: operation.options.sigmaY,
              sizeX: operation.options.sizeX,
              sizeY: operation.options.sizeY,
            });
          }
          break;
        }
        case 'INVERT': {
          result = applyOn.invert();

          break;
        }
        case 'FLIP': {
          if (applyOn instanceof Image) {
            result = applyOn.flip({
              axis: operation.options.axis,
            });
          }
          break;
        }
        case 'LEVEL': {
          if (applyOn instanceof Image) {
            result = applyOn.level({
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
            result = applyOn.pixelate({
              cellSize: operation.options.cellSize,
              algorithm: operation.options.algorithm,
            });
          }
          break;
        }
        case 'MEDIAN_FILTER': {
          if (applyOn instanceof Image) {
            result = applyOn.medianFilter({
              cellSize: operation.options.cellSize,
              borderType: operation.options.borderType,
              borderValue: operation.options.borderValue,
            });
          }
          break;
        }
        case 'DILATE': {
          result = applyOn.dilate({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          break;
        }
        case 'ERODE': {
          result = applyOn.erode({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          break;
        }
        case 'OPEN': {
          result = applyOn.open({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          break;
        }
        case 'CLOSE': {
          result = applyOn.close({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          break;
        }
        case 'RESIZE': {
          if (applyOn instanceof Image) {
            result = applyOn.resize({
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
            result = applyOn.rotate(
              (operation.options.angle *
                (operation.options.clockwise ? 1 : -1)) as RotateAngle,
            );
          }
          break;
        }
        default:
          throw new Error(`Unknown operation type ${(operation as any).type}`);
      }
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
