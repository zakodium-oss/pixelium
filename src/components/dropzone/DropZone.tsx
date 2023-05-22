import { fileCollectionFromFiles } from 'filelist-utils';
import { decode } from 'image-js';
import { memo, useCallback } from 'react';
import { DropZoneContainer } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import { LOAD_DROP, SET_LOADING } from '../../state/data/DataActionTypes';
import { ImageWithMetadata } from '../../state/data/DataReducer';

interface DropZoneProps {
  children: JSX.Element | null;
}

function DropZone({ children }: DropZoneProps) {
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

  const handleOnDrop = useCallback(
    (acceptedFiles) => {
      dataDispatch({ type: SET_LOADING, payload: true });
      loadFiles(acceptedFiles).finally(() =>
        dataDispatch({ type: SET_LOADING, payload: false }),
      );
    },
    [dataDispatch, loadFiles],
  );

  return (
    <DropZoneContainer
      emptyText="Drag and drop here either an image or a Pixelium file."
      onDrop={handleOnDrop}
    >
      {children}
    </DropZoneContainer>
  );
}

export default memo(DropZone);
