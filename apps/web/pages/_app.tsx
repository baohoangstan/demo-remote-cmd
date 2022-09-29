import { AppProps } from 'next/app';
import Head from 'next/head';
// import './styles.less';
import 'antd/dist/antd.less';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to web!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
