import { appData } from "@/constants";
import Head from "next/head";

const SeoHead = ({ title }) => {
  return (
    <Head>
      <title>
        {title} | {appData.name}
      </title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta
        property="og:title"
        content="Platform where you get tractor related parts in one place"
      />
      <meta
        name="og:description"
        content="Platform where you get tractor related parts in one place"
      />
      <meta property="og:type" content="website" />
      <meta
        name="description"
        content="Platform where you get tractor related parts in one place"
      />
      <meta name="keywords" content="tractor,spare parts,machinary" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SeoHead;
