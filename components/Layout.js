import React from 'react';
import Header from './Header';
import Head from "next/head";
import {Container} from "semantic-ui-react";

const Layout = (props) => {
    return (
        <Container>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
            </Head>
            <Header/>
            {props.children}
        </Container>
    );
}
export default Layout;