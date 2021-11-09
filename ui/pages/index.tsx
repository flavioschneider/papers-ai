import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Box, Grid, Text, Span, Link } from '@styles/components';
import { styled } from '@styles/config';
import * as Icon from 'react-feather';
import annot from 'public/annot.json'

function getFileName(name) {
  return name.substring(0, name.lastIndexOf('.'))
}

export default function Home() {

  return (
    <Box column center>
      <Box container css={{py: '$6'}}>
        <Text type='title' css={{ pb: '$4' }}>Papers</Text>
        { 
          annot.map((data, id) => {
            return( 
              <Text key={id}  mono css={{ pb: '$3'}}>
                <Link underline href={`/pdf/${getFileName(data.file)}`}> { data.title } </Link>
              </Text>
            ) 
          }) 
        }        
      </Box>
    </Box>
  );
}