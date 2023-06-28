import { fileCollectionFromFiles, FileCollectionItem } from 'filelist-utils';
import { decode } from 'image-js';
import { useCallback } from 'react';

import { LOAD_DROP, SET_LOADING } from '../state/data/DataActionTypes';
import { DataFile } from '../state/data/DataReducer';

import useDataDispatch from './useDataDispatch';
import useLog from './useLog';

export default function useFileLoader() {
  const dataDispatch = useDataDispatch();

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
      dataDispatch({ type: LOAD_DROP, payload: dataFiles });
      return dataFiles.length;
    },
    [dataDispatch, logger],
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
