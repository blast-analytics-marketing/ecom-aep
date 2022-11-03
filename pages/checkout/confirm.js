import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic'

const OrderConfirm = dynamic(() => import('../../components/checkout/Confirm'),
  { ssr: false }
)

function Confirm() {
  return (
    <>
      <Head>
        <title>Order Confirm | Blast Analytics | Store</title>
      </Head>
      <OrderConfirm />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      page: 'Order Confirm',
      category: 'Checkout',
      title: 'Order Confirm | Blast Analytics | Store'
    }, // is passed up to the custom app as pageProps
  }
}

export default Confirm;
