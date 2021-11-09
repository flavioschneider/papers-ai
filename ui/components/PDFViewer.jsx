import { useState, useMemo, useCallback } from 'react';
import { styled } from '@styles/config';
import { Box, Link } from '@styles/components';
import NextLink from 'next/link';
import { Document, Page, StyleSheet, pdfjs } from 'react-pdf';
import useMeasure from 'react-use-measure'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Wrapper = styled('div', {
  '.react-pdf__Page': {
    mb: '$2',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;',
  }
});

const Entity = styled(Link, {
  backgroundColor: 'gray',
  borderRadius: '$2',
  px: '$1',
  py: '1px',
  opacity: 0.5 
});

function highlightEntities(text, entities) {
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  const words = entities.map((entity) => escapeRegExp(entity.value));
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
        entities.forEach((entity) => {
          if (entity.value.toUpperCase() === value.toUpperCase()) {
            prev.slices.push(
              <Entity key={id} id={entity.data.name} css={{ bc: entity.color }} href='#'>
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
  const [ref, bounds] = useMeasure()

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    //removeTextLayerOffset();
    setNumPages(nextNumPages);
  }

  const textRenderer = useCallback((textItem) => {
    return highlightEntities(textItem.str, entities);
  }, []);

  return (
      <Wrapper ref={ref}>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              width={bounds.width}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={true}
              customTextRenderer={textRenderer}
            />
          ))}
        </Document>
      </Wrapper>
  );
}
