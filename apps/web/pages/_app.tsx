import { AppProps } from 'next/app';
import Head from 'next/head';
// import './styles.less';
import 'antd/dist/antd.less';
import MainLayout from '../components/Layout/layout';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to web!</title>
      </Head>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
}

export default CustomApp;
