import { Box } from '@styles/components';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@components/PDFViewer'), { ssr: false });

const Component = (props) => {
  const example = [{ value: 'a', type: 'MODEL' }];
  return (
    <>
      <Box>
        <PDFViewer file="attention.pdf" entities={example} />
      </Box>
    </>
  );
};

export default Component;
