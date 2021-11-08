import { useState, useMemo, useCallback } from 'react';
import { styled } from '@styles/config';
import { Box } from '@styles/components';
import NextLink from 'next/link';
import { Document, Page, StyleSheet, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Wrapper = styled('div', {
  pt: '$4',
  '.react-pdf__Document': {
    //mx: '$1',
    lineHeight: 1,
  },
  '.react-pdf__Page': {
    mb: '$2',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;',
  },
});

const Entity = styled('span', {
  backgroundColor: 'rgba(9, 132, 227,0.5)',
  borderRadius: '$2',
  px: '$1',
  py: '1px',
});

const colors = {
  MODEL: 'rgba(254, 202, 87,0.5)',
  DATASET: 'rgba(255, 107, 107,0.5)',
  TASK: 'rgba(243, 104, 224,0.5)',
};

function highlightPatterns(text, patterns) {
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  const words = patterns.map((pattern) => escapeRegExp(pattern.value));
  var wordsRegex = new RegExp('\\b(?:' + words.join('|') + ')\\b', 'gi');
  const matches = [...text.matchAll(wordsRegex)];

  if (matches.length > 0) {
    const data = matches.reduce(
      (prev, match, id, arr) => {
        const value = match[0];
        // Save slice before match
        prev.slices.push(text.substring(prev.cursor, match.index));
        prev.cursor = match.index + value.length;
        // Save component from match
        patterns.forEach((pattern) => {
          if (pattern.value.toUpperCase() === value.toUpperCase()) {
            prev.slices.push(
              <Entity key={id} css={{ bc: colors[pattern.type] }}>
                {value}
              </Entity>
            );
          }
        });
        return prev;
      },
      { cursor: 0, slices: [] }
    );
    // Add slice after last match
    data.slices.push(text.substring(data.cursor));
    return data.slices;
  }

  return text;
}

export default function PDFViewer({ file, entities }) {
  const [numPages, setNumPages] = useState(0);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    removeTextLayerOffset();
    setNumPages(nextNumPages);
  }

  const textRenderer = useCallback((textItem) => {
    return highlightPatterns(textItem.str, entities);
  }, []);

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll('.react-pdf__Page__textContent');
    textLayers.forEach((layer) => {
      const { style } = layer;
      style.top = '0';
      style.left = '0';
      style.transform = '';
    });
  }

  return (
    <Box column center>
      <Wrapper>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={true}
              customTextRenderer={textRenderer}
            />
          ))}
        </Document>
      </Wrapper>
    </Box>
  );
}
