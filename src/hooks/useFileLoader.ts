import { v4 as uuid } from '@lukeed/uuid';
import {
  fileCollectionFromFiles,
  FileCollection,
  fileCollectionFromWebSource,
  WebSource,
} from 'filelist-utils';
import { decode } from 'image-js';
import { useCallback } from 'react';

import {
  LOAD_DROP,
  LOAD_PIXELIUM,
  SET_LOADING,
} from '../state/data/DataActionTypes';
import { DataFile } from '../state/data/DataReducer';
import { INITIALIZE_PREFERENCES } from '../state/preferences/PreferenceActionTypes';
import { LOAD_VIEW_STATE, OPEN_TAB } from '../state/view/ViewActionTypes';
import { loadPixeliumBundle } from '../utils/export';

import useDataDispatch from './useDataDispatch';
import useLog from './useLog';
import usePreferencesDispatch from './usePreferencesDispatch';
import useViewDispatch from './useViewDispatch';

function getPixelInfo(fields) {
  let pixelSize;
  let pixelUnits;
  for (const [, tagValue] of Object.entries(fields)) {
    if (typeof tagValue === 'string' && tagValue.startsWith('<')) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(tagValue, 'text/xml');
      const dataNodes = xmlDoc.querySelectorAll('Data');
      for (const dataNode of dataNodes) {
        const label = dataNode.querySelector('Label')?.textContent;
        if (label === 'Magnification') {
          const value = dataNode.querySelector('Value')?.textContent;
          if (value) {
            const pixelValue = 30000 / Number(value);
            pixelUnits = 'nm';
            pixelSize = pixelValue.toString();
          }
        }
      }
    }
  }
  return { pixelSize, pixelUnits };
}

export default function useFileLoader() {
  const dataDispatch = useDataDispatch();
  const preferencesDispatch = usePreferencesDispatch();
  const viewDispatch = useViewDispatch();

  const { logger } = useLog();

  const loadFileCollection = useCallback(
    async (fileCollection: FileCollection) => {
      const dataFiles: DataFile[] = [];
      let pixeliumId;
      // for each image, decode it
      for (const file of fileCollection) {
        if (file.name.includes('.pixelium')) {
          logger.info(`Loading pixelium file ${file.name}`);
          const buffer = await file.arrayBuffer();
          const { data, preferences, view } = await loadPixeliumBundle(
            buffer,
            logger,
          );
          if (data !== null) {
            dataDispatch({
              type: LOAD_PIXELIUM,
              payload: data,
            });
            if (view === null) {
              pixeliumId = Object.keys(data.images).at(-1);
            }
          }
          if (preferences !== null) {
            preferencesDispatch({
              type: INITIALIZE_PREFERENCES,
              payload: preferences,
            });
          }
          if (view !== null) {
            viewDispatch({
              type: LOAD_VIEW_STATE,
              payload: view,
            });
          }
        } else {
          try {
            const image = decode(new Uint8Array(await file.arrayBuffer()));

            const fields = Object.fromEntries(image.meta?.tiff?.fields || []);
            const { pixelSize, pixelUnits } = getPixelInfo(fields);
            const metadata = {
              name: file.name,
              relativePath: file.relativePath,
              pixelSize,
              pixelUnits,
            };
            dataFiles.push({
              image,
              metadata,
              pipeline: [],
              rois: [],
            });
          } catch {
            logger.error(`Error decoding file ${file.name}`);
          }
        }
      }

      const ids = dataFiles.map(() => uuid());
      if (dataFiles.length !== ids.length) {
        logger.error('The number of files and ids must be the same');
        return 0;
      }
      const files = Object.fromEntries(
        ids.map((id, index) => [id, dataFiles[index]]),
      );

      dataDispatch({ type: LOAD_DROP, payload: files });

      const newId = ids.at(-1);

      if (newId || pixeliumId) {
        viewDispatch({ type: OPEN_TAB, payload: newId || pixeliumId });
      }

      return dataFiles.length;
    },
    [dataDispatch, logger, preferencesDispatch, viewDispatch],
  );

  const loadFiles = useCallback(
    async (files: File[]) => {
      const fileCollection = await fileCollectionFromFiles(files).catch(() => {
        logger.error('Error loading files');
        return new FileCollection([]);
      });
      return loadFileCollection(fileCollection);
    },
    [loadFileCollection, logger],
  );

  const handleFileLoad = useCallback(
    (acceptedFiles) => {
      dataDispatch({ type: SET_LOADING, payload: true });
      loadFiles(acceptedFiles)
        .then((count) =>
          logger.info(
            count === 0 ? 'No image loaded' : `Loaded ${count} images`,
          ),
        )
        .finally(() => dataDispatch({ type: SET_LOADING, payload: false }));
    },
    [dataDispatch, loadFiles, logger],
  );

  const handleWebSource = useCallback(
    (source: WebSource) => {
      dataDispatch({ type: SET_LOADING, payload: true });
      return fileCollectionFromWebSource(source)
        .then(loadFileCollection)
        .then((count) => {
          if (count > 0) {
            logger.info(`${count} images loaded from WebSource`);
          }
        })
        .finally(() => dataDispatch({ type: SET_LOADING, payload: false }));
    },
    [dataDispatch, loadFileCollection, logger],
  );

  return { handleFileLoad, handleWebSource };
}
