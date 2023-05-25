import { fileCollectionFromFiles } from 'filelist-utils';
import { decode } from 'image-js';
import { useCallback } from 'react';

import { LOAD_DROP, SET_LOADING } from '../state/data/DataActionTypes';
import { ImageWithMetadata } from '../state/data/DataReducer';

import useDataDispatch from './useDataDispatch';

export default function useFileLoader() {
  const dataDispatch = useDataDispatch();

  const loadFiles = useCallback(
    async (files: File[]) => {
      // TODO handle errors
      const fileCollection = await fileCollectionFromFiles(files);
      const imagesWithMetadata: ImageWithMetadata[] = [];

      // for each image, decode it
      for (const file of fileCollection.files) {
        const image = decode(new Uint8Array(await file.arrayBuffer()));
        const metadata = {
          name: file.name,
          relativePath: file.relativePath,
        };
        imagesWithMetadata.push({
          image,
          metadata,
        });
      }
      dataDispatch({ type: LOAD_DROP, payload: imagesWithMetadata });
    },
    [dataDispatch],
  );

  const handleFileLoad = useCallback(
    (acceptedFiles) => {
      dataDispatch({ type: SET_LOADING, payload: true });
      loadFiles(acceptedFiles).finally(() =>
        dataDispatch({ type: SET_LOADING, payload: false }),
      );
    },
    [dataDispatch, loadFiles],
  );

  return handleFileLoad;
}
