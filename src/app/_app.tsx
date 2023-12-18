import React from 'react';
import { AppProps } from 'next/app';
import SessionAuthProvider from '../context/SessionAuthProviders';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionAuthProvider>
      <Component {...pageProps} />
    </SessionAuthProvider>
  );
};

export default MyApp;
