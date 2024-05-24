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

    try {
      switch (operation.type) {
        case 'GREY_FILTER': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.grey({
              algorithm: operation.options.algorithm,
            });
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
          }
          break;
        }
        case 'CONVERT': {
          if (applyOn instanceof Image) {
            let result = applyOn;
            if (operation.options.colorModel !== applyOn.colorModel) {
              result = result.convertColor(operation.options.colorModel);
            }
            if (operation.options.bitDepth !== applyOn.bitDepth) {
              result = result.convertBitDepth(operation.options.bitDepth);
            }
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
            });
          }
          break;
        }
        case 'BLUR': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.blur({
              width: operation.options.width,
              height: operation.options.height,
              borderType: operation.options.borderType,
              borderValue: operation.options.borderValue,
            });
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
          }
          break;
        }
        case 'MASK': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.threshold({
              algorithm: operation.options.algorithm,
              slots: operation.options.slots,
            });
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
          }
          break;
        }
        case 'GAUSSIAN_BLUR': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.gaussianBlur({
              sigmaX: operation.options.sigmaX,
              sigmaY: operation.options.sigmaY,
              sizeX: operation.options.sizeX,
              sizeY: operation.options.sizeY,
            });
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
          }
          break;
        }
        case 'INVERT': {
          const time0 = Date.now();
          const result = applyOn.invert();
          const time = Date.now() - time0;
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
            time,
          });
          break;
        }
        case 'FLIP': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.flip({
              axis: operation.options.axis,
            });
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
          }
          break;
        }
        case 'LEVEL': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.level({
              channels: operation.options.channels,
              inputMin: operation.options.inputMin,
              inputMax: operation.options.inputMax,
              outputMin: operation.options.outputMin,
              outputMax: operation.options.outputMax,
              gamma: operation.options.gamma,
            });
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
          }
          break;
        }
        case 'PIXELATE': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.pixelate({
              cellSize: operation.options.cellSize,
              algorithm: operation.options.algorithm,
            });
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
          }
          break;
        }
        case 'MEDIAN_FILTER': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.medianFilter({
              cellSize: operation.options.cellSize,
              borderType: operation.options.borderType,
              borderValue: operation.options.borderValue,
            });
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
          }
          break;
        }
        case 'DILATE': {
          const time0 = Date.now();
          const result = applyOn.dilate({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          const time = Date.now() - time0;
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
            time,
          });
          break;
        }
        case 'ERODE': {
          const time0 = Date.now();
          const result = applyOn.erode({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          const time = Date.now() - time0;
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
            time,
          });
          break;
        }
        case 'OPEN': {
          const time0 = Date.now();
          const result = applyOn.open({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          const time = Date.now() - time0;
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
            time,
          });
          break;
        }
        case 'CLOSE': {
          const time0 = Date.now();
          const result = applyOn.close({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          const time = Date.now() - time0;
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
            time,
          });
          break;
        }
        case 'RESIZE': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.resize({
              width: operation.options.width,
              height: operation.options.height,
              interpolationType: operation.options.interpolationType,
              borderValue: operation.options.borderValue,
              preserveAspectRatio: operation.options.preserveAspectRatio,
              borderType: operation.options.borderType,
            });
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
          }
          break;
        }
        case 'ROTATE': {
          if (applyOn instanceof Image) {
            const time0 = Date.now();
            const result = applyOn.rotate(
              (operation.options.angle *
                (operation.options.clockwise ? 1 : -1)) as RotateAngle,
            );
            const time = Date.now() - time0;
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
              time,
            });
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
  }

  return { pipelineSteps, pipelineError };
}
