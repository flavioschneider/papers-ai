import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { getCssText } from '@styles/config';

const FONT_SERIF = 'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap';
const FONT_SANS = 'https://fonts.googleapis.com/css2?family=Inter&display=swap';
const FONT_MONO = 'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@5.2/distr/fira_code.css';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
          <link rel="icon" href="/favicon.png" />

          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href={FONT_SERIF} rel="preload" as="style" />
          <link href={FONT_SERIF} rel="stylesheet" media="all" />
          <link href={FONT_SANS} rel="preload" as="style" />
          <link href={FONT_SANS} rel="stylesheet" media="all" />
          <link href={FONT_MONO} rel="preload" as="style" />
          <link href={FONT_MONO} rel="stylesheet" media="all" />

          <noscript>
            <link href={FONT_SERIF} rel="stylesheet" />
            <link href={FONT_SANS} rel="stylesheet" />
            <link href={FONT_MONO} rel="stylesheet" />
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
