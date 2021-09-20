import { globalCss } from './config';

export const globalStyles = globalCss({
  '*, *::after, *::before': {
    boxSizing: 'inherit',
  },
  html: {
    boxSizing: 'border-box',
  },
  body: {
    backgroundColor: '$background',
    margin: 0,
  },
  ul: {
    paddingLeft: '$4',
  },
  button: {
    outline: 0,
  },
});
