import { globalStyles } from '@styles/global';
import { darkTheme } from '@styles/config';
import { Box } from '@styles/components'
import { ThemeProvider } from 'next-themes';
import ThemeSwitch from '@components/ThemeSwitch';

function MyApp({ Component, pageProps }) {
  globalStyles();

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        value={{
          dark: darkTheme.className,
          light: 'light',
        }}
      >
        <Component {...pageProps} />
        
        <Box css={{ position: 'fixed', bottom: '$3', right: '$3' }}>
          <ThemeSwitch />
        </Box>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
