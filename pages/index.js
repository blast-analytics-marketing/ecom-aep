import React from 'react';
import Head from 'next/head';
import Root from '../components/common/Root';
import Footer from '../components/common/Footer';
import SocialMedia from '../components/common/SocialMedia';
import ExploreBanner from '../components/productAssets/ExploreBanner';
import HeroSection from '../components/homepage/HeroSection';
import HomeBanner from '../components/homepage/HomeBanner';
import CategoryBanner from '../components/homepage/CategoryBanner';
import ProductsBanner from '../components/homepage/ProductsBanner';

const Home = () => (
  <Root transparentHeader={true}>
    <Head>
      <title>Home | Blast Analytics | Store</title>
    </Head>

    <HeroSection />
    <HomeBanner />
    <CategoryBanner location="home"/>
    <ProductsBanner />
    <ExploreBanner location="home"/>
    <SocialMedia location="home"/>
    <Footer />
  </Root>
);

export async function getStaticProps() {
  return {
    props: {
      page: 'Home',
      category: 'Content',
      title: 'Home | Blast Analytics | Store'
    }, // is passed up to the custom app as pageProps
  }
}

export default Home;
