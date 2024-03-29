import {AppProps} from 'next/app';
import Head from 'next/head';
import {FC} from 'react';
import Notifications from '../components/Notification'

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({Component, pageProps}) => {
    return (
        <>
            <Head>
                <title>Sesame</title>
            </Head>

            <div className="flex flex-col h-screen">
                <Notifications/>
                <Component {...pageProps} />
            </div>
        </>
    );
};

export default App;
