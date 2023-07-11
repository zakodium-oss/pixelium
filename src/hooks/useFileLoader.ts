import { fileCollectionFromFiles, FileCollectionItem } from 'filelist-utils';
import { decode } from 'image-js';
import { useCallback } from 'react';

import {
  LOAD_DROP,
  LOAD_PIXELIUM,
  SET_LOADING,
} from '../state/data/DataActionTypes';
import { DataFile } from '../state/data/DataReducer';
import { INITIALIZE_PREFERENCES } from '../state/preferences/PreferenceActionTypes';
import { LOAD_VIEW_STATE } from '../state/view/ViewActionTypes';
import { loadPixeliumBundle } from '../utils/export';

import useDataDispatch from './useDataDispatch';
import useLog from './useLog';
import usePreferencesDispatch from './usePreferencesDispatch';
import useViewDispatch from './useViewDispatch';

export default function useFileLoader() {
  const dataDispatch = useDataDispatch();
  const preferencesDispatch = usePreferencesDispatch();
  const viewDispatch = useViewDispatch();

  const { logger } = useLog();

  const loadFiles = useCallback(
    async (files: File[]) => {
      const fileCollection = await fileCollectionFromFiles(files)
        .then((fileCollection) => fileCollection.files)
        .catch(() => {
          logger.error('Error loading files');
          return [] as FileCollectionItem[];
        });
      const dataFiles: DataFile[] = [];

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
            const metadata = {
              name: file.name,
              relativePath: file.relativePath,
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
      dataDispatch({ type: LOAD_DROP, payload: dataFiles });
      return dataFiles.length;
    },
    [dataDispatch, logger, preferencesDispatch, viewDispatch],
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

  return handleFileLoad;
}
