import { Image, Mask } from 'image-js';

import { logger } from '../components/context/LogContext';
import { PipelineOperations } from '../state/data/actions/pipeline/PipelineOperations';

interface PipelineStep {
  identifier: string;
  result: Image | Mask;
}

export default function runPipeline(
  pipeline: PipelineOperations[],
  baseImage: Image,
) {
  const pipelineSteps: PipelineStep[] = [];
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
            const result = applyOn.grey({
              algorithm: operation.options.algorithm,
            });
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
            });
          }
          break;
        }
        case 'BLUR': {
          if (applyOn instanceof Image) {
            const result = applyOn.blur({
              width: operation.options.width,
              height: operation.options.height,
              borderType: operation.options.borderType,
              borderValue: operation.options.borderValue,
            });
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
            });
          }
          break;
        }
        case 'MASK': {
          if (applyOn instanceof Image) {
            const result = applyOn.threshold({
              algorithm: operation.options.algorithm,
            });
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
            });
          }
          break;
        }
        case 'GAUSSIAN_BLUR': {
          if (applyOn instanceof Image) {
            const result = applyOn.gaussianBlur({
              sigmaX: operation.options.sigmaX,
              sigmaY: operation.options.sigmaY,
              sizeX: operation.options.sizeX,
              sizeY: operation.options.sizeY,
            });
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
            });
          }
          break;
        }
        case 'INVERT': {
          const result = applyOn.invert();
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
          });
          break;
        }
        case 'FLIP': {
          if (applyOn instanceof Image) {
            const result = applyOn.flip({
              axis: operation.options.axis,
            });
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
            });
          }
          break;
        }
        case 'LEVEL': {
          if (applyOn instanceof Image) {
            const result = applyOn.level({
              channels: operation.options.channels,
              inputMin: operation.options.inputMin,
              inputMax: operation.options.inputMax,
              outputMin: operation.options.outputMin,
              outputMax: operation.options.outputMax,
              gamma: operation.options.gamma,
            });
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
            });
          }
          break;
        }
        case 'PIXELATE': {
          if (applyOn instanceof Image) {
            const result = applyOn.pixelate({
              cellSize: operation.options.cellSize,
              algorithm: operation.options.algorithm,
            });
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
            });
          }
          break;
        }
        case 'MEDIAN_FILTER': {
          if (applyOn instanceof Image) {
            const result = applyOn.medianFilter({
              cellSize: operation.options.cellSize,
              borderType: operation.options.borderType,
              borderValue: operation.options.borderValue,
            });
            pipelineSteps.push({
              identifier: operation.identifier,
              result,
            });
          }
          break;
        }
        case 'DILATE': {
          const result = applyOn.dilate({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
          });
          break;
        }
        case 'ERODE': {
          const result = applyOn.erode({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
          });
          break;
        }
        case 'OPEN': {
          const result = applyOn.open({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
          });
          break;
        }
        case 'CLOSE': {
          const result = applyOn.close({
            kernel: operation.options.kernel,
            iterations: operation.options.iterations,
          });
          pipelineSteps.push({
            identifier: operation.identifier,
            result,
          });
          break;
        }
        default:
          throw new Error(`Unknown operation type ${(operation as any).type}`);
      }
    } catch (error: any) {
      logger.error(error.message);
      break;
    }
  }

  return pipelineSteps;
}
