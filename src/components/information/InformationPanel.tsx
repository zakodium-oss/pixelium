import { InfoPanel, InfoPanelData } from 'react-science/ui';

import useImage from '../../hooks/useImage';
import useImageMetadata from '../../hooks/useImageInformations';

export default function InformationPanel() {
  const { original } = useImage();

  const { info, meta } = useImageMetadata(original);
  const data: InfoPanelData[] = [
    { description: 'General Informations', data: info },
    {
      description: 'Metadatas',
      data: meta,
    },
  ];

  return <InfoPanel title="" data={data} />;
}
