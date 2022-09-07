import type {NextPage} from "next";
import Head from "next/head";
import {Scanner} from "../components/Scanner";

const Home: NextPage = (props) => {
    return (
        <>
            <Head>
                <title>Sesame Scanner React</title>
                <meta name="description" content="Sesame Scanner React"/>
            </Head>
            <Scanner key={"scanner"}></Scanner>
        </>
    );
};

export default Home;
