import { createStitches } from '@stitches/react';
import { gray, grayDark } from '@radix-ui/colors';

export const { css, globalCss, styled, getCssText, createTheme } = createStitches({
  theme: {
    colors: {
      ...gray,
      primary: 'rgba(255, 221, 0, 1)',
      contrast1: '$gray1', // Background
      contrast2: '$gray2', // Subtle background
      contrast3: '$gray3', // Element normal background
      contrast4: '$gray4', // Element hovered background
      contrast5: '$gray5', // Element active/selected/pressed background
      contrast6: '$gray6', // Subtle border, separator
      contrast7: '$gray7', // Element border, focus ring
      contrast8: '$gray8', // Element hovered border
      contrast9: '$gray9', // Solid background
      contrast10: '$gray10', // Solid hovered background
      contrast11: '$gray11', // Text low contrast
      contrast12: '$gray12', // Text hight contrast
      background: '$gray1',
    },
    fonts: {
      serif: '',
      sans: 'Inter, sans-serif',
      mono: 'Fira Code VF, monospace',
    },
    fontSizes: {
      1: '12px',
      2: '14px',
      3: '16px',
      4: '20px',
      5: '24px',
      6: '32px',
      7: '36px',
      8: '48px',
      9: '64px',
    },
    space: {
      1: '4px',
      2: '8px',
      3: '16px',
      4: '32px',
      5: '64px',
      6: '128px',
      7: '256px',
      8: '512px',
    },
    sizes: {
      1: '4px',
      2: '8px',
      3: '16px',
      4: '32px',
      5: '64px',
      6: '128px',
      7: '256px',
      8: '512px',
      container: '700px',
    },
    lineHeights: {
      1: '18px',
      2: '21px',
      3: '24px',
      4: '32px',
      5: '36px',
      6: '48px',
      7: '56px',
      8: '64px',
      9: '72px',
    },
    radii: {
      1: '2px',
      2: '4px',
      3: '8px',
      round: '9999px',
    },
  },
  media: {
    bp1: '(min-width: 575px)',
    bp2: '(min-width: 750px)',
    bp3: '(min-width: 1000px)',
    bp4: '(min-width: 1200px)',
  },
  utils: {
    p: (value) => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value,
    }),
    pt: (value) => ({
      paddingTop: value,
    }),
    pr: (value) => ({
      paddingRight: value,
    }),
    pb: (value) => ({
      paddingBottom: value,
    }),
    pl: (value) => ({
      paddingLeft: value,
    }),
    px: (value) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    m: (value) => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value,
    }),
    mt: (value) => ({
      marginTop: value,
    }),
    mr: (value) => ({
      marginRight: value,
    }),
    mb: (value) => ({
      marginBottom: value,
    }),
    ml: (value) => ({
      marginLeft: value,
    }),
    mx: (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value) => ({
      marginTop: value,
      marginBottom: value,
    }),
    size: (value) => ({
      width: value,
      height: value,
    }),
    bc: (value) => ({
      backgroundColor: value,
    }),
  },
});

export const darkTheme = createTheme({
  colors: {
    ...grayDark,
    contrast1: '$gray1',
    contrast2: '$gray2',
    contrast3: '$gray3',
    contrast4: '$gray4',
    contrast5: '$gray5',
    contrast6: '$gray6',
    contrast7: '$gray7',
    contrast8: '$gray8',
    contrast9: '$gray9',
    contrast10: '$gray10',
    contrast11: '$gray11',
    contrast12: '$gray12',
    background: '$gray1',
  },
});
