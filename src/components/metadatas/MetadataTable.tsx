import styled from '@emotion/styled';
import { Table, ValueRenderers } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import useImageMetadata from '../../hooks/useImageMetadata';

const MissingMetadata = styled.div`
  margin-top: 8px;
  font-size: 1.5em;
  text-align: center;
`;

export default function MetadataTable() {
  const currentTab = useCurrentTab();
  const { original } = useImage(currentTab);

  const metadata = useImageMetadata(original);

  if (metadata.length === 0) {
    return <MissingMetadata>No metadata found</MissingMetadata>;
  }

  return (
    <Table>
      {metadata.map(({ key, render }) => (
        <Table.Row key={key}>
          <ValueRenderers.Text value={key} />
          {render}
        </Table.Row>
      ))}
    </Table>
  );
}
