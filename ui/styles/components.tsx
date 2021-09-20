import { css, styled } from './config';

export const Box = styled('div', {
  variants: {
    row: {
      true: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
    },
    column: {
      true: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
    },
    center: {
      true: {
        alignItems: 'center',
      },
    },
    container: {
      true: {
        width: '$container',
        px: '$4',
      },
    },
  },
});

export const Text = styled('p', {
  margin: 0,
  color: '$contrast12',
  fontFamily: '$sans',
  fontSize: '$3',
  fontWeight: 300,
  lineHeight: '$5',

  variants: {
    type: {
      title: {
        fontSize: '$7',
        fontWeight: 500,
        lineHeight: '$7',
      },
      subtitle: {
        fontSize: '$4',
        fontWeight: 500,
        lineHeight: '$4',
      },
    },
    mono: {
      true: {
        fontFamily: '$mono',
        fontSize: '$2',
        fontWeight: '370',
        color: '$contrast11',
      },
    },
  },
});

export const Span = styled('span', {});

export const Link = styled('a', {
  color: 'inherit',
  textDecoration: 'inherit',
  transition: 'all 100ms linear 0ms',
  borderRadius: '$1',

  '&:hover': {
    opacity: 0.6,
  },

  '&:focus': {
    outline: 'none',
    opacity: 0.4,
  },

  variants: {
    underline: {
      true: {
        textDecoration: 'underline',
      },
    },
  },
});
