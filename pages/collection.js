import React from 'react';
import Head from 'next/head';
import Root from '../components/common/Root';
import ExploreBanner from '../components/productAssets/ExploreBanner';
import Collections from '../components/collections/Collections';
import SocialMedia from '../components/common/SocialMedia';
import Footer from '../components/common/Footer';

const Home = () => (
  <Root>
    <Head>
      <title>Collection | Blast Analytics | Store</title>
    </Head>
    <Collections />
    <ExploreBanner location="PLP: Shop All"/>
    <SocialMedia location="PLP: Shop All"/>
    <Footer />
  </Root>
);

export async function getStaticProps() {
  return {
    props: {
      page: 'Shop All',
      category: 'PLP',
      title: 'Shop All | Blast Analytics | Store'
    }, // is passed up to the custom app as pageProps
  }
}

export default Home;
