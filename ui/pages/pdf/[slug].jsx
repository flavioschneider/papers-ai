import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Box, Grid, Text, Span, Link } from '@styles/components';
import { styled } from '@styles/config';
import * as Icon from 'react-feather';
import annotations from 'public/annot.json'

const PDFViewer = dynamic(() => import('@components/PDFViewer'), { ssr: false });

const Info = styled(Link, {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '$3',
  p: '$3'
})

const InfoTitle = styled(Text, {
  lineHeight: '1',
  fontFamily: '$sans',
  fontSize: '$1',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: '$gray1',
  opacity: 0.7
})

const InfoPrimary = styled(Text, {
  py: '$2',
  color: '$gray2',
  textTransform: 'capitalize',
  fontFamily: '$mono',
  fontSize: '$1',
  lineHeight: '$1',
  flex: '1',
})

const InfoSecondary = styled(Text, {
  lineHeight: '1',
  fontFamily: '$sans',
  fontSize: '$1',
  fontWeight: '300',
  color: '$gray1',
  opacity: 0.7
})

const gradients = [
  'linear-gradient(90deg, rgba(241,196,15,1) 0%, rgba(243,156,18,1) 100%)',
  'linear-gradient(90deg, rgba(230,126,34,1) 0%, rgba(211,84,0,1) 100%)',
  'linear-gradient(90deg, rgba(231,76,60,1) 0%, rgba(192,57,43,1) 100%)',
  'linear-gradient(90deg, rgba(155,89,182,1) 0%, rgba(142,68,173,1) 100%)',
  'linear-gradient(90deg, rgba(52,152,219,1) 0%, rgba(41,128,185,1) 100%)',
  'linear-gradient(90deg, rgba(26,188,156,1) 0%, rgba(22,160,133,1) 100%)'
]

const colors = [
  'rgba(241,196,15,1)',
  'rgba(230,126,34,1)',
  'rgba(231,76,60,1)',
  'rgba(155,89,182,1)',
  'rgba(52,152,219,1)',
  'rgba(26,188,156,1)'
]

export default function PDF({ data }) {

  // TODO: some items are not in the list 
  if (!data || !data.country) return <p>None</p>

  const annots = [
    { name: 'country', ...data.country },
    { name: 'sample size', ...data.sample_size },
    { name: 'effect size', ...data.effect_size },
    { name: 'grade', ...data.grade },
    { name: 'school', ...data.school },
    { name: 'subject', ...data.subject }
  ]


  // PDF entities 
  const entities = annots.map((data, id) => {
    return {
      value: data.answer,
      color: colors[id],
      data
    }
  })

  return (
    <Box column center>
      <Box container css={{py: '$3'}}>
        
        <Text mono css={{ pt: '$4', pb: '$2'}}>
          <Link underline href="/"> {'<-'} Home</Link>
        </Text>
        <Text type='title' css={{ pt: '$5', pb: '$4'}}>
          { data.title }
        </Text>
        <Text mono css={{ pt: '$2', pb: '$3'}}>
          Summary
        </Text>
        <Grid>
          {
            annots.map((data, id) => {
              return (
                <Info key={id} href={`#${data.name}`} css={{ background: gradients[id] }}>
                  <InfoTitle>
                    { data.name } 
                  </InfoTitle>
                  <InfoPrimary>
                    { data.answer } {/*· { data.score.toFixed(2) } */}
                  </InfoPrimary>
                  <InfoSecondary>
                  { data.score.toFixed(2) } confidence
                  </InfoSecondary>
                </Info>
              )
            })
          }
        </Grid>
        <Text mono css={{ pt: '$5', pb: '$3'}}>
          Annotated PDF
        </Text>
        <Box css={{pb: '$4'}}>
          <PDFViewer file={`../pdfs/${data.file_pdf}`} entities={entities} />
        </Box>
      </Box>
    </Box>
  );
}

function getFileName(name) {
  return name.substring(0, name.lastIndexOf('.'))
}

/*
 * This function is called at build time to generate all paths of: pdf/[slug]
 */
export async function getStaticPaths() {
  const paths = {
    paths: annotations.map((annotation) => {
      const slug = getFileName(annotation.file)
      return { params: { slug } }
    }),
    fallback: false,
  };
  return paths;
}

/*
 * This function returns the props for a post given the uuid, again called once for each post at build time.
 */
export async function getStaticProps(context) {
  const slug = context.params.slug

  const data = annotations.find((annotation) => {
    const name = getFileName(annotation.file)
    return name == slug 
  })
  data.file_pdf = getFileName(data.file)+'.pdf'

  return { props: { data } };
}
