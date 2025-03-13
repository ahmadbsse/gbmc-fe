import { appData } from "@/constants";
import Head from "next/head";

const SeoHead = ({ title }) => {
  const pageTitle = `${title} | ${appData.name}`;
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const description = "Platform where you get tractor related parts in one place";

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="tractor,spare parts,machinery,agricultural equipment,tractor parts"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={appData.name} />
      <meta
        property="og:image"
        content="http://www.globalmeccanica.com/wp-content/uploads/2019/11/133985a1-c185-4d00-aca3-d016e23c775d-300x78.jpg"
      />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default SeoHead;
